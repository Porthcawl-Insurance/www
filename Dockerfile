from nginx:stable-alpine
copy nginx.conf /etc/nginx/conf.d/default.conf
copy public /usr/share/nginx/html
