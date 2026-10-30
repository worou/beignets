<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\CategoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;

#[ORM\Entity(repositoryClass: CategoryRepository::class)]
#[ApiResource(
    operations: [new GetCollection(), new Get()],
    normalizationContext: ['groups' => ['category:read']],
    order: ['position' => 'ASC'],
    paginationEnabled: false,
)]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['category:read', 'product:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 80)]
    #[Groups(['category:read', 'product:read'])]
    private string $name = '';

    #[ORM\Column(length: 80, unique: true)]
    #[Groups(['category:read', 'product:read'])]
    private string $slug = '';

    #[ORM\Column(length: 160, nullable: true)]
    #[Groups(['category:read'])]
    private ?string $tagline = null;

    /** Couleur de marque utilisée par le front : green, yellow, orange, brown, red. */
    #[ORM\Column(length: 20)]
    #[Groups(['category:read', 'product:read'])]
    private string $color = 'green';

    #[ORM\Column]
    #[Groups(['category:read'])]
    private int $position = 0;

    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getSlug(): string { return $this->slug; }
    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }

    public function getTagline(): ?string { return $this->tagline; }
    public function setTagline(?string $tagline): static { $this->tagline = $tagline; return $this; }

    public function getColor(): string { return $this->color; }
    public function setColor(string $color): static { $this->color = $color; return $this; }

    public function getPosition(): int { return $this->position; }
    public function setPosition(int $position): static { $this->position = $position; return $this; }
}
