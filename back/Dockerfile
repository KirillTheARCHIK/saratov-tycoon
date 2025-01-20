FROM node:18

WORKDIR /var/www/back

RUN chown -R ${ARG_UID}:${ARG_GID} "/var/www/back"

RUN echo 'ping localhost &' > /bootstrap.sh
RUN echo 'sleep infinity' >> /bootstrap.sh
RUN chmod +x /bootstrap.sh

CMD /bootstrap.sh
# CMD node ./src/index.js