<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

/**
 * Comptes d'administration, gérés depuis l'espace Mamie : liste, ajout,
 * suppression et changement de son propre mot de passe.
 *
 * Un administrateur ne peut pas supprimer son propre compte : la boutique
 * garde ainsi toujours au moins un accès.
 */
#[AsController]
#[IsGranted('ROLE_ADMIN')]
final class AdminAccountController
{
    public const MIN_PASSWORD_LENGTH = 10;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $users,
        private readonly UserPasswordHasherInterface $hasher,
    ) {
    }

    #[Route('/api/admin/accounts', name: 'admin_accounts_list', methods: ['GET'], priority: 10)]
    public function list(#[CurrentUser] User $me): JsonResponse
    {
        $accounts = array_map(
            fn (User $u) => $this->serialize($u, $me),
            $this->users->findBy([], ['email' => 'ASC']),
        );

        return new JsonResponse($accounts);
    }

    #[Route('/api/admin/accounts', name: 'admin_accounts_create', methods: ['POST'], priority: 10)]
    public function create(Request $request, #[CurrentUser] User $me): JsonResponse
    {
        $data = $request->toArray();
        $email = mb_strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, \FILTER_VALIDATE_EMAIL)) {
            return $this->invalid('email', 'Cette adresse e-mail n’est pas valide.');
        }
        if ($error = $this->passwordError($password)) {
            return $this->invalid('password', $error);
        }
        if ($this->users->findOneBy(['email' => $email])) {
            return $this->invalid('email', 'Un compte existe déjà avec cette adresse.', Response::HTTP_CONFLICT);
        }

        $user = (new User())->setEmail($email)->setRoles(['ROLE_ADMIN']);
        $user->setPassword($this->hasher->hashPassword($user, $password));
        $this->em->persist($user);
        $this->em->flush();

        return new JsonResponse($this->serialize($user, $me), Response::HTTP_CREATED);
    }

    #[Route('/api/admin/accounts/{id}', name: 'admin_accounts_delete', methods: ['DELETE'], requirements: ['id' => '\d+'], priority: 10)]
    public function delete(int $id, #[CurrentUser] User $me): Response
    {
        $user = $this->users->find($id);
        if (!$user) {
            return new JsonResponse(['detail' => 'Ce compte n’existe plus.'], Response::HTTP_NOT_FOUND);
        }
        if ($user->getId() === $me->getId()) {
            // 409 et non 403 : le front déconnecte sur 401/403.
            return new JsonResponse(['detail' => 'Vous ne pouvez pas supprimer votre propre compte.'], Response::HTTP_CONFLICT);
        }

        $this->em->remove($user);
        $this->em->flush();

        return new Response(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/api/admin/password', name: 'admin_password_change', methods: ['POST'], priority: 10)]
    public function changePassword(Request $request, #[CurrentUser] User $me): JsonResponse
    {
        $data = $request->toArray();
        $current = (string) ($data['currentPassword'] ?? '');
        $new = (string) ($data['newPassword'] ?? '');

        if (!$this->hasher->isPasswordValid($me, $current)) {
            return $this->invalid('currentPassword', 'Le mot de passe actuel est incorrect.');
        }
        if ($error = $this->passwordError($new)) {
            return $this->invalid('newPassword', $error);
        }

        $me->setPassword($this->hasher->hashPassword($me, $new));
        $this->em->flush();

        return new JsonResponse(['detail' => 'Mot de passe modifié.']);
    }

    private function passwordError(string $password): ?string
    {
        return mb_strlen($password) < self::MIN_PASSWORD_LENGTH
            ? sprintf('Le mot de passe doit contenir au moins %d caractères.', self::MIN_PASSWORD_LENGTH)
            : null;
    }

    /** Même forme que les erreurs de validation d'API Platform, lue telle quelle par le front. */
    private function invalid(string $field, string $message, int $status = Response::HTTP_UNPROCESSABLE_ENTITY): JsonResponse
    {
        return new JsonResponse([
            'detail' => $message,
            'violations' => [['propertyPath' => $field, 'message' => $message]],
        ], $status);
    }

    /** @return array{id: int|null, email: string, me: bool} */
    private function serialize(User $user, User $me): array
    {
        return ['id' => $user->getId(), 'email' => $user->getEmail(), 'me' => $user->getId() === $me->getId()];
    }
}
