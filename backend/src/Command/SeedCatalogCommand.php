<?php

namespace App\Command;

use App\Catalog\CatalogData;
use App\Entity\Category;
use App\Entity\Product;
use App\Entity\ProductVariant;
use App\Enum\ProductKind;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(name: 'app:seed', description: 'Crée le catalogue initial (catégories, produits, formats) s’il est vide.')]
final class SeedCatalogCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly CategoryRepository $categories,
        private readonly ProductRepository $products,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this->addOption('force', null, InputOption::VALUE_NONE, 'Ajoute les éléments manquants même si le catalogue n’est pas vide.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        if (!$input->getOption('force') && $this->products->count([]) > 0) {
            $io->note('Catalogue déjà présent : rien à faire.');

            return Command::SUCCESS;
        }

        $bySlug = [];
        foreach (CatalogData::CATEGORIES as $position => $row) {
            $category = $this->categories->findOneBy(['slug' => $row['slug']]) ?? new Category();
            $category->setSlug($row['slug'])->setName($row['name'])->setColor($row['color'])
                ->setTagline($row['tagline'])->setPosition($position);
            $this->em->persist($category);
            $bySlug[$row['slug']] = $category;
        }

        $created = 0;
        foreach (CatalogData::PRODUCTS as $position => $row) {
            if (null !== $this->products->findOneBy(['slug' => $row['slug']])) {
                continue;
            }
            $product = (new Product())
                ->setSlug($row['slug'])
                ->setName($row['name'])
                ->setCategory($bySlug[$row['category']])
                ->setKind(ProductKind::from($row['kind']))
                ->setShortDescription($row['short'])
                ->setDescription($row['description'])
                ->setImage($row['image'])
                ->setUnitLabel($row['unitLabel'])
                ->setFeatured($row['featured'])
                ->setPosition($position);

            foreach ($row['variants'] as $i => $v) {
                $product->addVariant((new ProductVariant())
                    ->setLabel($v['label'])
                    ->setDescription($v['description'])
                    ->setPieces($v['pieces'])
                    ->setPriceCents($v['price'])
                    ->setPosition($i));
            }
            $this->em->persist($product);
            ++$created;
        }

        $this->em->flush();
        $io->success(sprintf('%d catégories, %d produits créés.', \count($bySlug), $created));

        return Command::SUCCESS;
    }
}
