FROM nikolaik/python-nodejs:latest as build
WORKDIR /usr/src/app
COPY ./requirements.txt ./
RUN pip install -r requirements.txt
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nikolaik/python-nodejs:latest
WORKDIR /app
COPY ./ ./
COPY --from=build /usr/src/app/dist ./dist
RUN npm install
ARG NODE_ENV production
ENV NODE_ENV ${NODE_ENV}
ENV PORT 4000
EXPOSE $PORT
CMD ["node", "dist/index.js"]