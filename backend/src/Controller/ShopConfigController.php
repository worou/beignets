<?php

namespace App\Controller;

use App\Service\Pricing;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Paramètres publics de la boutique, lus par le front au démarrage.
 */
#[AsController]
final class ShopConfigController
{
    public function __construct(
        private readonly Pricing $pricing,
        #[Autowire('%shop.whatsapp_number%')] private readonly string $whatsappNumber,
    ) {
    }

    #[Route('/api/shop-config', name: 'shop_config', methods: ['GET'], priority: 10)]
    public function __invoke(): JsonResponse
    {
        $response = new JsonResponse([
            'whatsappNumber' => $this->whatsappNumber,
            'deliveryFeeCents' => $this->pricing->deliveryFeeCents(),
            'freeDeliveryThresholdCents' => $this->pricing->freeDeliveryThresholdCents(),
            'minimumOrderCents' => $this->pricing->minimumOrderCents(),
            'deliveryArea' => 'Paris et Île-de-France',
            'deliveryPostalPrefixes' => ['75', '77', '78', '91', '92', '93', '94', '95'],
            'timeSlots' => ['9h – 12h', '12h – 15h', '15h – 18h', '18h – 20h'],
        ]);
        $response->setPublic();
        $response->setMaxAge(300);

        return $response;
    }
}
