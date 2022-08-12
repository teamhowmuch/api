FROM node:18
RUN yarn install
EXPOSE 8080
CMD ['yarn', 'start:dev']