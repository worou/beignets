<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\ContactMessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactMessageRepository::class)]
#[ApiResource(
    operations: [
        new Post(denormalizationContext: ['groups' => ['contact:write']]),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Patch(security: "is_granted('ROLE_ADMIN')", denormalizationContext: ['groups' => ['contact:admin']]),
    ],
    normalizationContext: ['groups' => ['contact:read']],
    order: ['createdAt' => 'DESC'],
)]
class ContactMessage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['contact:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 120)]
    #[Groups(['contact:read', 'contact:write'])]
    #[Assert\NotBlank(message: 'Merci d’indiquer votre nom.')]
    #[Assert\Length(max: 120)]
    private string $name = '';

    #[ORM\Column(length: 180)]
    #[Groups(['contact:read', 'contact:write'])]
    #[Assert\NotBlank(message: 'Merci d’indiquer votre e-mail.')]
    #[Assert\Email(message: 'Cette adresse e-mail n’est pas valide.')]
    private string $email = '';

    #[ORM\Column(length: 30, nullable: true)]
    #[Groups(['contact:read', 'contact:write'])]
    #[Assert\Length(max: 30)]
    private ?string $phone = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['contact:read', 'contact:write'])]
    #[Assert\NotBlank(message: 'Votre message est vide.')]
    #[Assert\Length(min: 10, max: 3000, minMessage: 'Votre message est un peu court (10 caractères minimum).')]
    private string $message = '';

    #[ORM\Column]
    #[Groups(['contact:read', 'contact:admin'])]
    private bool $handled = false;

    #[ORM\Column]
    #[Groups(['contact:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): static { $this->name = trim($name); return $this; }

    public function getEmail(): string { return $this->email; }
    public function setEmail(string $email): static { $this->email = trim($email); return $this; }

    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(?string $phone): static { $this->phone = $phone; return $this; }

    public function getMessage(): string { return $this->message; }
    public function setMessage(string $message): static { $this->message = trim($message); return $this; }

    public function isHandled(): bool { return $this->handled; }
    public function setHandled(bool $handled): static { $this->handled = $handled; return $this; }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
