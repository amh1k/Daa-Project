// Q2 Part (ii): Integer Multiplication - Karatsuba Algorithm O(n^1.585)
#include <iostream>
#include <fstream>
#include <string>
#include <algorithm>
#include <chrono>
#include <vector>
#include <sstream>
using namespace std;

int nodeId = 0;
int maxDepth = 0;

struct TreeNode {
    int id;
    string x, y, result;
    int depth;
    string type; // "z2", "z0", "z1", or "root"
    vector<TreeNode*> children;

    TreeNode(string _x, string _y, int _depth, string _type = "root")
        : x(_x), y(_y), depth(_depth), type(_type) {
        id = nodeId++;
        if (depth > maxDepth) maxDepth = depth;
    }
};

string trim(string s) {
    size_t p = s.find_first_not_of('0');
    return (p == string::npos) ? "0" : s.substr(p);
}

string add(string a, string b) {
    string res = "";
    int carry = 0, i = a.size()-1, j = b.size()-1;
    while (i >= 0 || j >= 0 || carry) {
        int sum = carry;
        if (i >= 0) sum += a[i--] - '0';
        if (j >= 0) sum += b[j--] - '0';
        res = char('0' + sum%10) + res;
        carry = sum/10;
    }
    return trim(res);
}

string sub(string a, string b) {
    string res = "";
    int borrow = 0, i = a.size()-1, j = b.size()-1;
    while (i >= 0) {
        int diff = (a[i--] - '0') - borrow;
        if (j >= 0) diff -= (b[j--] - '0');
        if (diff < 0) { diff += 10; borrow = 1; }
        else borrow = 0;
        res = char('0' + diff) + res;
    }
    return trim(res);
}

void makeEqual(string& a, string& b) {
    int d = a.size() - b.size();
    if (d > 0) b = string(d, '0') + b;
    else if (d < 0) a = string(-d, '0') + a;
}

string shift(string s, int n) {
    return (s == "0") ? "0" : s + string(n, '0');
}

string naive(string a, string b) {
    int n = a.size(), m = b.size();
    string res(n+m, '0');
    for (int i = n-1; i >= 0; i--)
        for (int j = m-1, k = i+m, c = 0; j >= 0 || c; j--, k--) {
            int p = (j >= 0 ? (a[i]-'0')*(b[j]-'0') : 0) + (res[k]-'0') + c;
            res[k] = '0' + p%10;
            c = p/10;
        }
    return trim(res);
}

string karatsuba(string x, string y) {
    makeEqual(x, y);
    int n = x.size();
    if (n <= 10) return naive(x, y);

    int m = n/2;
    string a = x.substr(0, n-m), b = x.substr(n-m);
    string c = y.substr(0, n-m), d = y.substr(n-m);

    string z2 = karatsuba(a, c);
    string z0 = karatsuba(b, d);
    string z1 = karatsuba(add(a,b), add(c,d));
    z1 = sub(sub(z1, z2), z0);

    return add(add(shift(z2, 2*m), shift(z1, m)), z0);
}

string karatsubaWithTree(string x, string y, TreeNode* node) {
    makeEqual(x, y);
    int n = x.size();

    if (n <= 10) {
        node->result = naive(x, y);
        return node->result;
    }

    int m = n/2;
    string a = x.substr(0, n-m), b = x.substr(n-m);
    string c = y.substr(0, n-m), d = y.substr(n-m);

    // Create child nodes for z2, z0, z1
    TreeNode* z2Node = new TreeNode(a, c, node->depth + 1, "z2");
    TreeNode* z0Node = new TreeNode(b, d, node->depth + 1, "z0");
    TreeNode* z1Node = new TreeNode(add(a,b), add(c,d), node->depth + 1, "z1");

    node->children.push_back(z2Node);
    node->children.push_back(z0Node);
    node->children.push_back(z1Node);

    string z2 = karatsubaWithTree(a, c, z2Node);
    string z0 = karatsubaWithTree(b, d, z0Node);
    string z1 = karatsubaWithTree(add(a,b), add(c,d), z1Node);
    z1 = sub(sub(z1, z2), z0);
    z1Node->result = z1; // Update z1 after subtraction

    node->result = add(add(shift(z2, 2*m), shift(z1, m)), z0);
    return node->result;
}

string truncate(string s, int maxLen = 20) {
    if (s.size() <= maxLen) return s;
    int half = maxLen / 2 - 2;
    return s.substr(0, half) + "..." + s.substr(s.size() - half);
}

void treeToJson(TreeNode* node, ofstream& out, int indent = 0) {
    string ind(indent, ' ');
    out << ind << "{\n";
    out << ind << "  \"id\": " << node->id << ",\n";
    out << ind << "  \"type\": \"" << node->type << "\",\n";
    out << ind << "  \"depth\": " << node->depth << ",\n";
    out << ind << "  \"x\": \"" << truncate(node->x) << "\",\n";
    out << ind << "  \"y\": \"" << truncate(node->y) << "\",\n";
    out << ind << "  \"result\": \"" << truncate(node->result) << "\",\n";
    out << ind << "  \"xDigits\": " << node->x.size() << ",\n";
    out << ind << "  \"yDigits\": " << node->y.size() << ",\n";
    out << ind << "  \"resultDigits\": " << node->result.size() << ",\n";
    out << ind << "  \"children\": [\n";

    for (size_t i = 0; i < node->children.size(); i++) {
        treeToJson(node->children[i], out, indent + 4);
        if (i < node->children.size() - 1) out << ",\n";
        else out << "\n";
    }

    out << ind << "  ]\n";
    out << ind << "}";
}

int main(int argc, char* argv[]) {
    string file = (argc > 1) ? argv[1] : "test_data/integer_multiplication/test_1_d100.txt";

    ifstream in(file);
    string num1, num2;
    getline(in, num1);
    getline(in, num2);
    in.close();

    num1 = trim(num1);
    num2 = trim(num2);

    // Regular execution for timing
    auto start = chrono::high_resolution_clock::now();
    string res = karatsuba(num1, num2);
    auto end = chrono::high_resolution_clock::now();
    double time_ms = chrono::duration<double, milli>(end - start).count();

    cout << "Integer Multiplication (d1=" << num1.size() << ", d2=" << num2.size() << "):\n";
    cout << "Product length: " << res.size() << " digits\n";
    if (res.size() <= 100) cout << "Product: " << res << "\n";
    else cout << "Product: " << res.substr(0, 50) << "..." << res.substr(res.size()-50) << "\n";
    cout << "Time: " << time_ms << " ms\n";

    // Generate tree visualization for smaller inputs (to keep tree manageable)
    TreeNode* root = nullptr;
    if (num1.size() <= 50) {
        nodeId = 0;
        maxDepth = 0;
        root = new TreeNode(num1, num2, 0, "root");
        karatsubaWithTree(num1, num2, root);
        cout << "Tree depth: " << maxDepth << "\n";
        cout << "Tree nodes: " << nodeId << "\n";
    }

    // Write output files
    string baseFile = file.substr(0, file.find_last_of('.'));

    ofstream out(baseFile + "_output.txt");
    out << "Num1: " << num1.size() << " digits\n";
    out << "Num2: " << num2.size() << " digits\n";
    out << "Product: " << res.size() << " digits\n";
    out << "Time: " << time_ms << " ms\n";
    out << "Result: " << res << "\n";
    out.close();

    // Write tree JSON if generated
    if (root) {
        ofstream treeOut(baseFile + "_tree.json");
        treeToJson(root, treeOut);
        treeOut.close();
    }

    return 0;
}
