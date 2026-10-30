FROM dunglas/frankenphp:1-php8.3

RUN apt-get update && apt-get install -y --no-install-recommends git unzip acl \
    && rm -rf /var/lib/apt/lists/* \
    && install-php-extensions pdo_pgsql intl zip opcache apcu

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    SERVER_NAME=":80" \
    APP_ENV=dev

WORKDIR /app

COPY composer.json composer.lock* ./
RUN composer install --prefer-dist --no-scripts --no-autoloader --no-interaction --no-progress

COPY . .
RUN composer dump-autoload --optimize \
    && composer run-script post-install-cmd \
    && sed -i 's/\r$//' docker/entrypoint.sh \
    && cp docker/entrypoint.sh /usr/local/bin/app-entrypoint \
    && chmod +x /usr/local/bin/app-entrypoint

EXPOSE 80
ENTRYPOINT ["app-entrypoint"]
CMD ["frankenphp", "run", "--config", "/app/docker/Caddyfile"]
