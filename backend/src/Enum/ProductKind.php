<?php

namespace App\Enum;

enum ProductKind: string
{
    case Unit = 'unit';
    case Bucket = 'bucket';
    case Extra = 'extra';
}
