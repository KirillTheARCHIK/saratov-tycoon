FROM node:21

WORKDIR /var/www/front

RUN chown -R ${ARG_UID}:${ARG_GID} "/var/www/front"

RUN echo 'ping localhost &' > /bootstrap.sh
RUN echo 'sleep infinity' >> /bootstrap.sh
RUN chmod +x /bootstrap.sh

CMD /bootstrap.sh