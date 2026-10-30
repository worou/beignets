<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use App\Enum\ProductKind;
use App\Repository\ProductRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Patch(security: "is_granted('ROLE_ADMIN')", denormalizationContext: ['groups' => ['product:admin']]),
    ],
    normalizationContext: ['groups' => ['product:read']],
    order: ['position' => 'ASC'],
    paginationEnabled: false,
)]
#[ApiFilter(SearchFilter::class, properties: ['category.slug' => 'exact', 'kind' => 'exact', 'slug' => 'exact'])]
#[ApiFilter(BooleanFilter::class, properties: ['featured'])]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['product:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['product:read'])]
    private ?Category $category = null;

    #[ORM\Column(length: 120)]
    #[Groups(['product:read', 'product:admin'])]
    #[Assert\NotBlank]
    private string $name = '';

    #[ORM\Column(length: 120, unique: true)]
    #[Groups(['product:read'])]
    private string $slug = '';

    #[ORM\Column(length: 20, enumType: ProductKind::class)]
    #[Groups(['product:read'])]
    private ProductKind $kind = ProductKind::Unit;

    #[ORM\Column(length: 255)]
    #[Groups(['product:read', 'product:admin'])]
    private string $shortDescription = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['product:read', 'product:admin'])]
    private ?string $description = null;

    #[ORM\Column(length: 255)]
    #[Groups(['product:read'])]
    private string $image = '';

    /** Ex. « / pièce », « / bucket ». */
    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['product:read'])]
    private ?string $unitLabel = null;

    #[ORM\Column]
    #[Groups(['product:read', 'product:admin'])]
    private bool $featured = false;

    #[ORM\Column]
    #[Groups(['product:read', 'product:admin'])]
    private bool $active = true;

    #[ORM\Column]
    #[Groups(['product:read'])]
    private int $position = 0;

    /** @var Collection<int, ProductVariant> */
    #[ORM\OneToMany(targetEntity: ProductVariant::class, mappedBy: 'product', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[ORM\OrderBy(['position' => 'ASC'])]
    #[Groups(['product:read'])]
    private Collection $variants;

    public function __construct()
    {
        $this->variants = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getCategory(): ?Category { return $this->category; }
    public function setCategory(Category $category): static { $this->category = $category; return $this; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): static { $this->name = $name; return $this; }

    public function getSlug(): string { return $this->slug; }
    public function setSlug(string $slug): static { $this->slug = $slug; return $this; }

    public function getKind(): ProductKind { return $this->kind; }
    public function setKind(ProductKind $kind): static { $this->kind = $kind; return $this; }

    public function getShortDescription(): string { return $this->shortDescription; }
    public function setShortDescription(string $shortDescription): static { $this->shortDescription = $shortDescription; return $this; }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }

    public function getImage(): string { return $this->image; }
    public function setImage(string $image): static { $this->image = $image; return $this; }

    public function getUnitLabel(): ?string { return $this->unitLabel; }
    public function setUnitLabel(?string $unitLabel): static { $this->unitLabel = $unitLabel; return $this; }

    public function isFeatured(): bool { return $this->featured; }
    public function setFeatured(bool $featured): static { $this->featured = $featured; return $this; }

    public function isActive(): bool { return $this->active; }
    public function setActive(bool $active): static { $this->active = $active; return $this; }

    public function getPosition(): int { return $this->position; }
    public function setPosition(int $position): static { $this->position = $position; return $this; }

    /** @return Collection<int, ProductVariant> */
    public function getVariants(): Collection { return $this->variants; }

    public function addVariant(ProductVariant $variant): static
    {
        if (!$this->variants->contains($variant)) {
            $this->variants->add($variant);
            $variant->setProduct($this);
        }

        return $this;
    }

    public function removeVariant(ProductVariant $variant): static
    {
        $this->variants->removeElement($variant);

        return $this;
    }

    /** Prix « à partir de », en centimes. */
    #[Groups(['product:read'])]
    public function getFromPriceCents(): ?int
    {
        $prices = [];
        foreach ($this->variants as $variant) {
            if ($variant->isActive()) {
                $prices[] = $variant->getPriceCents();
            }
        }

        return $prices ? min($prices) : null;
    }
}
