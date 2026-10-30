<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Ligne de commande. Le nom et le prix sont figés au moment de la commande.
 */
#[ORM\Entity]
class OrderItem
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'items')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private ?Order $customerOrder = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups(['order:write'])]
    #[Assert\NotNull(message: 'Produit inconnu.', groups: ['order:create'])]
    private ?ProductVariant $variant = null;

    #[ORM\Column(length: 120)]
    #[Groups(['order:read'])]
    private string $productName = '';

    #[ORM\Column(length: 60)]
    #[Groups(['order:read'])]
    private string $variantLabel = '';

    #[ORM\Column]
    #[Groups(['order:read'])]
    private int $unitPriceCents = 0;

    #[ORM\Column]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Range(min: 1, max: 200, notInRangeMessage: 'Quantité invalide (1 à 200).')]
    private int $quantity = 1;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private int $lineTotalCents = 0;

    public function getId(): ?int { return $this->id; }

    public function getCustomerOrder(): ?Order { return $this->customerOrder; }
    public function setCustomerOrder(?Order $customerOrder): static { $this->customerOrder = $customerOrder; return $this; }

    public function getVariant(): ?ProductVariant { return $this->variant; }
    public function setVariant(?ProductVariant $variant): static { $this->variant = $variant; return $this; }

    public function getProductName(): string { return $this->productName; }
    public function setProductName(string $productName): static { $this->productName = $productName; return $this; }

    public function getVariantLabel(): string { return $this->variantLabel; }
    public function setVariantLabel(string $variantLabel): static { $this->variantLabel = $variantLabel; return $this; }

    public function getUnitPriceCents(): int { return $this->unitPriceCents; }
    public function setUnitPriceCents(int $unitPriceCents): static { $this->unitPriceCents = $unitPriceCents; return $this; }

    public function getQuantity(): int { return $this->quantity; }
    public function setQuantity(int $quantity): static { $this->quantity = $quantity; return $this; }

    public function getLineTotalCents(): int { return $this->lineTotalCents; }
    public function setLineTotalCents(int $lineTotalCents): static { $this->lineTotalCents = $lineTotalCents; return $this; }
}
