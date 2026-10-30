<?php

namespace App\Catalog;

/**
 * Catalogue initial, repris des maquettes (prix en centimes).
 * Modifiable ensuite depuis l'espace admin.
 */
final class CatalogData
{
    public const CATEGORIES = [
        ['slug' => 'nature', 'name' => 'Nature', 'color' => 'green', 'tagline' => 'Moelleux et savoureux'],
        ['slug' => 'bananes', 'name' => 'Bananes', 'color' => 'yellow', 'tagline' => 'Une touche de douceur'],
        ['slug' => 'boules-ambiance', 'name' => 'Boules d’ambiance', 'color' => 'orange', 'tagline' => 'Légèrement sucrées'],
        ['slug' => 'haricots', 'name' => 'Haricots', 'color' => 'green', 'tagline' => 'Nature ou avec sauce'],
        ['slug' => 'sales', 'name' => 'Salés', 'color' => 'brown', 'tagline' => 'Viande / petits oignons'],
        ['slug' => 'sucres', 'name' => 'Sucrés', 'color' => 'red', 'tagline' => 'Nutella, confiture…'],
        ['slug' => 'mixtes', 'name' => 'Mixtes', 'color' => 'brown', 'tagline' => 'Un assortiment de nos 3 spécialités'],
        ['slug' => 'sauces', 'name' => 'Sauces', 'color' => 'red', 'tagline' => 'Pour accompagner vos beignets'],
    ];

    public const PRODUCTS = [
        // ——— Beignets à l'unité ———
        [
            'slug' => 'beignets-nature', 'category' => 'nature', 'kind' => 'unit', 'featured' => true,
            'name' => 'Beignets Nature', 'short' => 'Moelleux et savoureux',
            'description' => 'La recette d’origine de Mamie : une pâte levée, dorée à l’extérieur et fondante à cœur. Simple, généreux, irrésistible.',
            'image' => '/images/nature.jpg', 'unitLabel' => '/ pièce',
            'variants' => [['label' => 'À l’unité', 'description' => '1 beignet', 'pieces' => 1, 'price' => 49]],
        ],
        [
            'slug' => 'beignets-bananes', 'category' => 'bananes', 'kind' => 'unit', 'featured' => true,
            'name' => 'Beignets Bananes', 'short' => 'Une touche de douceur',
            'description' => 'Préparés avec des bananes bien mûres pour une douceur naturelle et un parfum incomparable.',
            'image' => '/images/banane.jpg', 'unitLabel' => '/ pièce',
            'variants' => [['label' => 'À l’unité', 'description' => '1 beignet', 'pieces' => 1, 'price' => 65]],
        ],
        [
            'slug' => 'boules-ambiance', 'category' => 'boules-ambiance', 'kind' => 'unit', 'featured' => true,
            'name' => 'Boules d’ambiance', 'short' => 'Légèrement sucrées',
            'description' => 'Petites boules dorées roulées dans le sucre, parfaites pour les fêtes et les moments de partage.',
            'image' => '/images/boules.jpg', 'unitLabel' => '/ pièce',
            'variants' => [['label' => 'À l’unité', 'description' => '1 boule', 'pieces' => 1, 'price' => 60]],
        ],
        [
            'slug' => 'beignets-haricots', 'category' => 'haricots', 'kind' => 'unit', 'featured' => false,
            'name' => 'Beignets Haricots', 'short' => 'Nature ou avec sauce',
            'description' => 'Les fameux beignets de haricots (akara), croustillants et parfumés. À déguster nature ou avec la sauce maison.',
            'image' => '/images/haricots.jpg', 'unitLabel' => '/ pièce',
            'variants' => [
                ['label' => 'Nature', 'description' => '1 beignet', 'pieces' => 1, 'price' => 80],
                ['label' => 'Avec sauce', 'description' => '1 beignet + sauce', 'pieces' => 1, 'price' => 150],
            ],
        ],
        [
            'slug' => 'beignets-sales', 'category' => 'sales', 'kind' => 'unit', 'featured' => true,
            'name' => 'Beignets Salés', 'short' => 'Viande / petits oignons',
            'description' => 'Une version salée et gourmande, garnie de viande hachée épicée et de petits oignons.',
            'image' => '/images/sales.jpg', 'unitLabel' => '/ pièce',
            'variants' => [['label' => 'À l’unité', 'description' => '1 beignet', 'pieces' => 1, 'price' => 75]],
        ],
        [
            'slug' => 'beignets-sucres', 'category' => 'sucres', 'kind' => 'unit', 'featured' => false,
            'name' => 'Beignets Sucrés', 'short' => 'Nutella, confiture…',
            'description' => 'Fourrés au Nutella ou à la confiture : le plaisir des petits et des grands.',
            'image' => '/images/sucres.jpg', 'unitLabel' => '/ pièce',
            'variants' => [['label' => 'À l’unité', 'description' => '1 beignet fourré', 'pieces' => 1, 'price' => 70]],
        ],
        // ——— Buckets ———
        [
            'slug' => 'bucket-nature', 'category' => 'nature', 'kind' => 'bucket', 'featured' => true,
            'name' => 'Bucket Nature', 'short' => 'Le classique à partager',
            'description' => 'Notre bucket signature rempli de beignets nature tout juste dorés.',
            'image' => '/images/bucket-nature.jpg', 'unitLabel' => '/ bucket',
            'variants' => [
                ['label' => 'Solo', 'description' => '10 beignets', 'pieces' => 10, 'price' => 490],
                ['label' => 'Duo', 'description' => '20 + 3 offerts', 'pieces' => 23, 'price' => 980],
                ['label' => 'Family', 'description' => '50 + 5 offerts', 'pieces' => 55, 'price' => 2450],
            ],
        ],
        [
            'slug' => 'bucket-bananes', 'category' => 'bananes', 'kind' => 'bucket', 'featured' => true,
            'name' => 'Bucket Bananes', 'short' => 'La douceur en format généreux',
            'description' => 'Des beignets à la banane, moelleux et parfumés, servis dans le bucket de Mamie.',
            'image' => '/images/bucket-banane.jpg', 'unitLabel' => '/ bucket',
            'variants' => [
                ['label' => 'Solo', 'description' => '10 beignets', 'pieces' => 10, 'price' => 650],
                ['label' => 'Duo', 'description' => '20 + 3 offerts', 'pieces' => 23, 'price' => 1300],
                ['label' => 'Family', 'description' => '50 + 5 offerts', 'pieces' => 55, 'price' => 3250],
            ],
        ],
        [
            'slug' => 'bucket-boules-ambiance', 'category' => 'boules-ambiance', 'kind' => 'bucket', 'featured' => true,
            'name' => 'Bucket Boules d’ambiance', 'short' => 'Pour mettre l’ambiance',
            'description' => 'Le format idéal pour les anniversaires, les fêtes et les apéros entre amis.',
            'image' => '/images/bucket-boules.jpg', 'unitLabel' => '/ bucket',
            'variants' => [
                ['label' => 'Solo', 'description' => '10 boules', 'pieces' => 10, 'price' => 600],
                ['label' => 'Duo', 'description' => '20 + 3 offertes', 'pieces' => 23, 'price' => 1200],
                ['label' => 'Family', 'description' => '50 + 5 offertes', 'pieces' => 55, 'price' => 3000],
            ],
        ],
        [
            'slug' => 'bucket-mixte', 'category' => 'mixtes', 'kind' => 'bucket', 'featured' => true,
            'name' => 'Bucket Mixte', 'short' => 'Nature, banane et boules d’ambiance',
            'description' => 'Un assortiment de nos trois spécialités pour goûter à tout. Le préféré des grandes tablées !',
            'image' => '/images/bucket-mixte.jpg', 'unitLabel' => '/ bucket',
            'variants' => [
                ['label' => 'Mixte Découverte', 'description' => '10 nature + 10 banane + 10 boules', 'pieces' => 30, 'price' => 1700],
                ['label' => 'Mixte Partage', 'description' => '20 nature + 20 banane + 20 boules', 'pieces' => 60, 'price' => 3400],
                ['label' => 'Mixte Family', 'description' => '50 nature + 50 banane + 50 boules', 'pieces' => 150, 'price' => 8700],
            ],
        ],
        // ——— Suppléments ———
        [
            'slug' => 'sauces-maison', 'category' => 'sauces', 'kind' => 'extra', 'featured' => false,
            'name' => 'Sauces maison', 'short' => 'En supplément',
            'description' => 'Pour tremper, napper, partager… Préparées maison chaque jour.',
            'image' => '/images/sauces.jpg', 'unitLabel' => '/ sauce',
            'variants' => [
                ['label' => 'Sauce pimentée', 'description' => 'Piment maison', 'pieces' => 0, 'price' => 50],
                ['label' => 'Sauce tomate-oignon', 'description' => 'Douce et parfumée', 'pieces' => 0, 'price' => 50],
                ['label' => 'Sauce chocolat', 'description' => 'Pour les gourmands', 'pieces' => 0, 'price' => 50],
            ],
        ],
    ];
}
