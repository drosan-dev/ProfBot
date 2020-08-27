FROM node:10-alpine
#
RUN mkdir /app
RUN mkdir /app/build
WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH
# COPY . ./
# #RUN npm i yarn
# RUN yarn --network-timeout 1000000
# RUN yarn build
COPY /build /app/build
RUN yarn global add serve
#
# #COPY package.json yarn.lock ./
# #RUN npm i yarn
# #RUN yarn install --network-timeout 1000000
# #RUN mkdir /app
# #RUN npm install --only=prod && mkdir /react-frontend && mv ./node_modules ./react-frontend
#
# #WORKDIR /app
#
# #COPY . .
#
# #RUN npm run build
#
# FROM nginx:1.17-alpine
#
# RUN rm /etc/nginx/conf.d/default.conf
# #COPY nginx.conf /etc/nginx/conf.d
#
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 3000 80
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# FROM nginx:alpine
#
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
#
# RUN rm -rf /usr/share/nginx/html/*
#
# COPY /build /usr/share/nginx/html
# EXPOSE 80
#
# CMD ["nginx", "-g", "daemon off;"]

# FROM nginx:1.17-alpine
# RUN mkdir /usr/share/nginx/html/admin
# COPY /build /usr/share/nginx/html/admin
#
# #COPY nginx.conf /etc/nginx/conf.d/default.conf
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.conf /etc/nginx/conf.d
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]