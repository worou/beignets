<?php

namespace App\Service;

use App\Entity\Order;
use App\Enum\Fulfilment;

/**
 * Source unique des règles tarifaires (frais de livraison, minimum de commande).
 * Le front lit ces valeurs via GET /api/shop-config.
 */
final class Pricing
{
    public function __construct(
        private readonly int $deliveryFeeCents,
        private readonly int $freeDeliveryThresholdCents,
        private readonly int $minimumOrderCents,
    ) {
    }

    public function subtotal(Order $order): int
    {
        $subtotal = 0;
        foreach ($order->getItems() as $item) {
            $variant = $item->getVariant();
            if (null !== $variant) {
                $subtotal += $variant->getPriceCents() * $item->getQuantity();
            }
        }

        return $subtotal;
    }

    public function deliveryFee(Fulfilment $fulfilment, int $subtotalCents): int
    {
        if (Fulfilment::Pickup === $fulfilment || $subtotalCents >= $this->freeDeliveryThresholdCents) {
            return 0;
        }

        return $this->deliveryFeeCents;
    }

    public function minimumOrderCents(): int { return $this->minimumOrderCents; }
    public function deliveryFeeCents(): int { return $this->deliveryFeeCents; }
    public function freeDeliveryThresholdCents(): int { return $this->freeDeliveryThresholdCents; }
}
