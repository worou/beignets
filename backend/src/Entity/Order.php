<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\Fulfilment;
use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use App\State\OrderProcessor;
use App\Validator\DeliverableOrder;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Types\UuidType;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: OrderRepository::class)]
#[ORM\Table(name: 'customer_order')]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Post(
            denormalizationContext: ['groups' => ['order:write']],
            validationContext: ['groups' => ['Default', 'order:create']],
            processor: OrderProcessor::class,
        ),
        // L'identifiant est un UUID non devinable : la page de confirmation peut le relire sans compte.
        new Get(),
        new GetCollection(security: "is_granted('ROLE_ADMIN')", paginationItemsPerPage: 50),
        new Patch(security: "is_granted('ROLE_ADMIN')", denormalizationContext: ['groups' => ['order:admin']]),
    ],
    normalizationContext: ['groups' => ['order:read']],
    order: ['createdAt' => 'DESC'],
)]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'exact', 'reference' => 'partial'])]
#[DeliverableOrder(groups: ['order:create'])]
class Order
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME)]
    #[Groups(['order:read'])]
    private Uuid $id;

    #[ORM\Column(length: 20, unique: true)]
    #[Groups(['order:read'])]
    private string $reference = '';

    #[ORM\Column(length: 120)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\NotBlank(message: 'Merci d’indiquer votre nom.')]
    #[Assert\Length(max: 120)]
    private string $customerName = '';

    #[ORM\Column(length: 180)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\NotBlank(message: 'Merci d’indiquer votre e-mail.')]
    #[Assert\Email(message: 'Cette adresse e-mail n’est pas valide.')]
    private string $email = '';

    #[ORM\Column(length: 30)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\NotBlank(message: 'Merci d’indiquer votre téléphone.')]
    #[Assert\Regex(pattern: '/^\+?[0-9 .\-()]{9,20}$/', message: 'Ce numéro de téléphone n’est pas valide.')]
    private string $phone = '';

    #[ORM\Column(length: 20, enumType: Fulfilment::class)]
    #[Groups(['order:read', 'order:write'])]
    private Fulfilment $fulfilment = Fulfilment::Delivery;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Length(max: 255)]
    private ?string $address = null;

    #[ORM\Column(length: 10, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    private ?string $postalCode = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Length(max: 100)]
    private ?string $city = null;

    #[ORM\Column(type: Types::DATE_IMMUTABLE, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    private ?\DateTimeImmutable $requestedDate = null;

    #[ORM\Column(length: 40, nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Length(max: 40)]
    private ?string $timeSlot = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Length(max: 1000)]
    private ?string $notes = null;

    #[ORM\Column(length: 20, enumType: OrderStatus::class)]
    #[Groups(['order:read', 'order:admin'])]
    private OrderStatus $status = OrderStatus::Pending;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private int $subtotalCents = 0;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private int $deliveryFeeCents = 0;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private int $totalCents = 0;

    #[ORM\Column]
    #[Groups(['order:read'])]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    #[Groups(['order:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    /** @var Collection<int, OrderItem> */
    #[ORM\OneToMany(targetEntity: OrderItem::class, mappedBy: 'customerOrder', cascade: ['persist', 'remove'], orphanRemoval: true)]
    #[Groups(['order:read', 'order:write'])]
    #[Assert\Count(min: 1, max: 40, minMessage: 'Votre panier est vide.')]
    #[Assert\Valid]
    private Collection $items;

    public function __construct()
    {
        $this->id = Uuid::v7();
        $this->createdAt = new \DateTimeImmutable();
        $this->items = new ArrayCollection();
    }

    #[ORM\PreUpdate]
    public function touch(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function getId(): Uuid { return $this->id; }

    public function getReference(): string { return $this->reference; }
    public function setReference(string $reference): static { $this->reference = $reference; return $this; }

    public function getCustomerName(): string { return $this->customerName; }
    public function setCustomerName(string $customerName): static { $this->customerName = trim($customerName); return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): static { $this->email = mb_strtolower(trim($email)); return $this; }

    public function getPhone(): string { return $this->phone; }
    public function setPhone(string $phone): static { $this->phone = trim($phone); return $this; }

    public function getFulfilment(): Fulfilment { return $this->fulfilment; }
    public function setFulfilment(Fulfilment $fulfilment): static { $this->fulfilment = $fulfilment; return $this; }

    public function getAddress(): ?string { return $this->address; }
    public function setAddress(?string $address): static { $this->address = $address; return $this; }

    public function getPostalCode(): ?string { return $this->postalCode; }
    public function setPostalCode(?string $postalCode): static { $this->postalCode = $postalCode ? trim($postalCode) : null; return $this; }

    public function getCity(): ?string { return $this->city; }
    public function setCity(?string $city): static { $this->city = $city; return $this; }

    public function getRequestedDate(): ?\DateTimeImmutable { return $this->requestedDate; }
    public function setRequestedDate(?\DateTimeImmutable $requestedDate): static { $this->requestedDate = $requestedDate; return $this; }

    public function getTimeSlot(): ?string { return $this->timeSlot; }
    public function setTimeSlot(?string $timeSlot): static { $this->timeSlot = $timeSlot; return $this; }

    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): static { $this->notes = $notes; return $this; }

    public function getStatus(): OrderStatus { return $this->status; }
    public function setStatus(OrderStatus $status): static { $this->status = $status; return $this; }

    public function getSubtotalCents(): int { return $this->subtotalCents; }
    public function setSubtotalCents(int $subtotalCents): static { $this->subtotalCents = $subtotalCents; return $this; }

    public function getDeliveryFeeCents(): int { return $this->deliveryFeeCents; }
    public function setDeliveryFeeCents(int $deliveryFeeCents): static { $this->deliveryFeeCents = $deliveryFeeCents; return $this; }

    public function getTotalCents(): int { return $this->totalCents; }
    public function setTotalCents(int $totalCents): static { $this->totalCents = $totalCents; return $this; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    public function getUpdatedAt(): ?\DateTimeImmutable { return $this->updatedAt; }

    /** @return Collection<int, OrderItem> */
    public function getItems(): Collection { return $this->items; }

    public function addItem(OrderItem $item): static
    {
        if (!$this->items->contains($item)) {
            $this->items->add($item);
            $item->setCustomerOrder($this);
        }

        return $this;
    }

    public function removeItem(OrderItem $item): static
    {
        $this->items->removeElement($item);

        return $this;
    }
}
