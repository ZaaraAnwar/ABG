<?php
/**
 * Plugin Name: ABG React Plugin
 * Description: React widgets for ABG
 */

if (!defined('ABSPATH')) {
    exit;
}

function abg_enqueue_react_app() {
    $plugin_url = plugin_dir_url(__FILE__);

    wp_enqueue_style(
        'abg-react-style',
        $plugin_url . 'build/assets/index.css',
        [],
        null
    );

    wp_enqueue_script(
        'abg-react-script',
        $plugin_url . 'build/assets/index.js',
        [],
        null,
        true
    );
}

function abg_render_app($atts) {
    static $instance = 0;
    $instance++;

    $atts = shortcode_atts([
        'chart' => 'abg-graph',
    ], $atts);

    abg_enqueue_react_app();

    return '<div class="abg-react-root" data-chart="' . esc_attr($atts['chart']) . '" data-instance="' . esc_attr($instance) . '"></div>';
}

add_shortcode('abg_app', 'abg_render_app');

add_filter('script_loader_tag', function($tag, $handle, $src) {
    if ($handle === 'abg-react-script') {
        return '<script type="module" src="' . esc_url($src) . '"></script>';
    }
    return $tag;
}, 10, 3);