<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit4b1ea87acaa9465ca759c2305d1ea40d
{
    public static $prefixLengthsPsr4 = array (
        'A' => 
        array (
            'Abraham\\TwitterOAuth\\' => 21,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'Abraham\\TwitterOAuth\\' => 
        array (
            0 => __DIR__ . '/..' . '/abraham/twitteroauth/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit4b1ea87acaa9465ca759c2305d1ea40d::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit4b1ea87acaa9465ca759c2305d1ea40d::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}
