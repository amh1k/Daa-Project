FROM node:20-bookworm

WORKDIR /app

RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*

COPY . .

WORKDIR /app/q2

RUN g++ closest_pair.cpp -o closest_pair -O2
RUN g++ integer_multiplication.cpp -o integer_multiplication -O2

WORKDIR /app/q2/ui

RUN npm ci
RUN npm run build

EXPOSE 7860

CMD ["npm", "run", "start", "--", "-p", "7860", "-H", "0.0.0.0"]