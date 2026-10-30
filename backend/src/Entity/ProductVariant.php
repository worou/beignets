<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Patch;
use App\Repository\ProductVariantRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Format vendable d'un produit : « À l'unité », « Solo (10) », « Duo (20 + 3) », etc.
 */
#[ORM\Entity(repositoryClass: ProductVariantRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new Patch(security: "is_granted('ROLE_ADMIN')", denormalizationContext: ['groups' => ['variant:admin']]),
    ],
    normalizationContext: ['groups' => ['variant:read']],
)]
class ProductVariant
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product:read', 'variant:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'variants')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Product $product = null;

    #[ORM\Column(length: 60)]
    #[Groups(['product:read', 'variant:read', 'variant:admin'])]
    #[Assert\NotBlank]
    private string $label = '';

    #[ORM\Column(length: 120, nullable: true)]
    #[Groups(['product:read', 'variant:read', 'variant:admin'])]
    private ?string $description = null;

    /** Nombre total de beignets (offerts compris). */
    #[ORM\Column]
    #[Groups(['product:read', 'variant:read'])]
    private int $pieces = 1;

    #[ORM\Column]
    #[Groups(['product:read', 'variant:read', 'variant:admin'])]
    #[Assert\PositiveOrZero]
    private int $priceCents = 0;

    #[ORM\Column]
    #[Groups(['product:read'])]
    private int $position = 0;

    #[ORM\Column]
    #[Groups(['product:read', 'variant:read', 'variant:admin'])]
    private bool $active = true;

    public function getId(): ?int { return $this->id; }

    public function getProduct(): ?Product { return $this->product; }
    public function setProduct(?Product $product): static { $this->product = $product; return $this; }

    public function getLabel(): string { return $this->label; }
    public function setLabel(string $label): static { $this->label = $label; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getPieces(): int { return $this->pieces; }
    public function setPieces(int $pieces): static { $this->pieces = $pieces; return $this; }

    public function getPriceCents(): int { return $this->priceCents; }
    public function setPriceCents(int $priceCents): static { $this->priceCents = $priceCents; return $this; }

    public function getPosition(): int { return $this->position; }
    public function setPosition(int $position): static { $this->position = $position; return $this; }

    public function isActive(): bool { return $this->active; }
    public function setActive(bool $active): static { $this->active = $active; return $this; }
}
