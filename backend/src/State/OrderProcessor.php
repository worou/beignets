<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Order;
use App\Enum\OrderStatus;
use App\Repository\OrderRepository;
use App\Service\Pricing;

/**
 * Création d'une commande : les prix envoyés par le client sont ignorés,
 * tout est recalculé côté serveur à partir du catalogue.
 *
 * @implements ProcessorInterface<Order, Order>
 */
final class OrderProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $persistProcessor,
        private readonly Pricing $pricing,
        private readonly OrderRepository $orders,
    ) {
    }

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Order
    {
        \assert($data instanceof Order);

        foreach ($data->getItems() as $item) {
            $item->setCustomerOrder($data);
            $variant = $item->getVariant();
            if (null === $variant) {
                continue;
            }
            $item
                ->setProductName($variant->getProduct()?->getName() ?? '')
                ->setVariantLabel($variant->getLabel())
                ->setUnitPriceCents($variant->getPriceCents())
                ->setLineTotalCents($variant->getPriceCents() * $item->getQuantity());
        }

        $subtotal = $this->pricing->subtotal($data);
        $fee = $this->pricing->deliveryFee($data->getFulfilment(), $subtotal);

        $data
            ->setStatus(OrderStatus::Pending)
            ->setSubtotalCents($subtotal)
            ->setDeliveryFeeCents($fee)
            ->setTotalCents($subtotal + $fee)
            ->setReference($this->newReference());

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }

    /** Ex. BDM-261030-K7Q2 */
    private function newReference(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        do {
            $suffix = '';
            for ($i = 0; $i < 4; ++$i) {
                $suffix .= $alphabet[random_int(0, \strlen($alphabet) - 1)];
            }
            $reference = sprintf('BDM-%s-%s', date('ymd'), $suffix);
        } while (null !== $this->orders->findOneBy(['reference' => $reference]));

        return $reference;
    }
}
