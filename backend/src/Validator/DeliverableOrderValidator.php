<?php

namespace App\Validator;

use App\Entity\Order;
use App\Enum\Fulfilment;
use App\Service\Pricing;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

/**
 * Règles métier d'une nouvelle commande : zone de livraison (Paris & IDF),
 * date souhaitée, produits disponibles et minimum de commande.
 */
final class DeliverableOrderValidator extends ConstraintValidator
{
    private const IDF_POSTAL_CODE = '/^(75|77|78|91|92|93|94|95)\d{3}$/';
    private const MAX_DAYS_AHEAD = 30;

    public function __construct(private readonly Pricing $pricing)
    {
    }

    public function validate(mixed $order, Constraint $constraint): void
    {
        if (!$constraint instanceof DeliverableOrder) {
            throw new UnexpectedTypeException($constraint, DeliverableOrder::class);
        }
        if (!$order instanceof Order) {
            return;
        }

        if (Fulfilment::Delivery === $order->getFulfilment()) {
            if (!trim((string) $order->getAddress())) {
                $this->context->buildViolation('Merci d’indiquer l’adresse de livraison.')->atPath('address')->addViolation();
            }
            if (!trim((string) $order->getCity())) {
                $this->context->buildViolation('Merci d’indiquer la ville.')->atPath('city')->addViolation();
            }
            if (!preg_match(self::IDF_POSTAL_CODE, (string) $order->getPostalCode())) {
                $this->context->buildViolation('Nous livrons uniquement Paris et l’Île-de-France (75, 77, 78, 91, 92, 93, 94, 95).')
                    ->atPath('postalCode')->addViolation();
            }
        }

        if (null !== $date = $order->getRequestedDate()) {
            $today = new \DateTimeImmutable('today');
            if ($date < $today) {
                $this->context->buildViolation('La date souhaitée est déjà passée.')->atPath('requestedDate')->addViolation();
            } elseif ($date > $today->modify('+'.self::MAX_DAYS_AHEAD.' days')) {
                $this->context->buildViolation('Les commandes sont possibles jusqu’à 30 jours à l’avance.')->atPath('requestedDate')->addViolation();
            }
        }

        foreach ($order->getItems() as $index => $item) {
            $variant = $item->getVariant();
            if (null !== $variant && (!$variant->isActive() || !$variant->getProduct()?->isActive())) {
                $this->context->buildViolation(sprintf('« %s » n’est plus disponible.', $variant->getProduct()?->getName() ?? 'Ce produit'))
                    ->atPath(sprintf('items[%d]', $index))->addViolation();
            }
        }

        $subtotal = $this->pricing->subtotal($order);
        if ($order->getItems()->count() > 0 && $subtotal < $this->pricing->minimumOrderCents()) {
            $this->context->buildViolation(sprintf(
                'Le minimum de commande est de %s €.',
                number_format($this->pricing->minimumOrderCents() / 100, 2, ',', ' ')
            ))->atPath('items')->addViolation();
        }
    }
}
