FROM nikolaik/python-nodejs:latest as development
WORKDIR /usr/src/app
COPY ./requirements.txt
RUN pip install -r requirements.txt
COPY ./package.json ./yarn.lock ./
RUN yarn
RUN yarn install
COPY ./ ./
RUN yarn build
ENV PORT 4000
EXPOSE $PORT


# Production mode
FROM nikolaik/python-nodejs:latest as production
RUN pip install scikit-learn numpy pandas simplejson
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=development /usr/src/app ./
ENV PORT 4000
EXPOSE $PORT
CMD ["node", "dist/main"]
