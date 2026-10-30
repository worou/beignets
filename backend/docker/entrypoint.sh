#!/bin/sh
set -e

# Dépendances (utile quand le code est monté en volume)
if [ ! -f vendor/autoload_runtime.php ]; then
    composer install --prefer-dist --no-interaction --no-progress
fi

# Assets de la documentation API (Swagger UI)
if [ ! -d public/bundles ]; then
    php bin/console assets:install public --no-interaction
fi

# Clés JWT
php bin/console lexik:jwt:generate-keypair --skip-if-exists

# Attente de PostgreSQL
echo "⏳ Attente de PostgreSQL..."
ATTEMPTS=0
until php bin/console dbal:run-sql -q "SELECT 1" >/dev/null 2>&1; do
    ATTEMPTS=$((ATTEMPTS+1))
    if [ "$ATTEMPTS" -ge 60 ]; then
        echo "PostgreSQL injoignable." >&2
        php bin/console dbal:run-sql "SELECT 1"
        exit 1
    fi
    sleep 1
done

php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration
php bin/console app:seed

if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ]; then
    php bin/console app:create-admin "$ADMIN_EMAIL" "$ADMIN_PASSWORD" --if-not-exists
fi

echo "✅ API prête sur http://localhost:8000/api"
exec docker-php-entrypoint "$@"
