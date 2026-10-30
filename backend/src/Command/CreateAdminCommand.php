<?php

namespace App\Command;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

/**
 * Crée un compte administrateur. Un compte existant n'est jamais modifié,
 * sauf demande explicite avec --reset-password.
 */
#[AsCommand(name: 'app:create-admin', description: 'Crée un compte administrateur (ou réinitialise son mot de passe avec --reset-password).')]
final class CreateAdminCommand extends Command
{
    private const MIN_PASSWORD_LENGTH = 10;

    public function __construct(
        private readonly EntityManagerInterface $em,
        private readonly UserRepository $users,
        private readonly UserPasswordHasherInterface $hasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'E-mail de connexion')
            ->addArgument('password', InputArgument::OPTIONAL, 'Mot de passe (demandé en saisie masquée s’il est omis)')
            ->addOption('if-not-exists', null, InputOption::VALUE_NONE, 'Ne rien faire si le compte existe déjà (démarrage Docker).')
            ->addOption('reset-password', null, InputOption::VALUE_NONE, 'Remplacer le mot de passe d’un compte existant.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = mb_strtolower(trim((string) $input->getArgument('email')));
        if (!filter_var($email, \FILTER_VALIDATE_EMAIL)) {
            $io->error(sprintf('« %s » n’est pas une adresse e-mail valide.', $email));

            return Command::INVALID;
        }

        $user = $this->users->findOneBy(['email' => $email]);
        if ($user && $input->getOption('if-not-exists')) {
            $io->note(sprintf('Le compte %s existe déjà, il n’a pas été modifié.', $email));

            return Command::SUCCESS;
        }
        if ($user && !$input->getOption('reset-password')) {
            $io->error(sprintf('Le compte %s existe déjà. Ajoutez --reset-password pour remplacer son mot de passe.', $email));

            return Command::FAILURE;
        }

        $password = (string) ($input->getArgument('password') ?? $io->askHidden('Mot de passe', function (?string $value): string {
            if (mb_strlen((string) $value) < self::MIN_PASSWORD_LENGTH) {
                throw new \RuntimeException(sprintf('%d caractères minimum.', self::MIN_PASSWORD_LENGTH));
            }

            return (string) $value;
        }));
        if (mb_strlen($password) < self::MIN_PASSWORD_LENGTH) {
            $io->error(sprintf('Le mot de passe doit contenir au moins %d caractères.', self::MIN_PASSWORD_LENGTH));

            return Command::INVALID;
        }

        $created = null === $user;
        $user ??= (new User())->setEmail($email);
        $user->setRoles(['ROLE_ADMIN']);
        $user->setPassword($this->hasher->hashPassword($user, $password));
        $this->em->persist($user);
        $this->em->flush();

        $io->success(sprintf($created ? 'Administrateur %s créé.' : 'Mot de passe de %s réinitialisé.', $email));

        return Command::SUCCESS;
    }
}
