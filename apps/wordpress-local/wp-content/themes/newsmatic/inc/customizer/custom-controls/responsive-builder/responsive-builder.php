<?php
/**
 * Responsive Builder Control
 * 
 * @package Newsmatic Pro
 * @since 1.4.0
 */
if( ! class_exists( 'Newsmatic_WP_Responsive_Builder_Control' ) ) :
    class Newsmatic_WP_Responsive_Builder_Control extends Newsmatic_WP_Base_Control {
        // control type
        public $type = 'responsive-builder';
        public $widgets = [];
        public $placement = 'header';
        public $related_section = [
            'count'	=>	'_row_count',
            'layout'	=>	'_row_column_layout'
        ];
        public $builder_settings_section = '';
        public $responsive_canvas_id = '';
        public $responsive_section = '';

        /**
         * Loads the jQuery UI button script and custom scripts/styles
         * 
         * @since 1.0.0
         * @access public
         * @return void
         */
        public function enqueue() {
            wp_enqueue_script( 'newsmatic-responsive-builder-js', get_template_directory_uri() . '/inc/customizer/custom-controls/responsive-builder/responsive-builder.js', ['jquery'], NEWSMATIC_VERSION, [ 'strategy' => 'defer', 'in_footer' => true ] );
        }
    
        /**
         * Add custom JSON parameters to use in the JS template.
         *
         * @since  1.0.0
         * @access public
         * @return void
         */
        public function to_json() {
            parent::to_json();
            $this->json['default'] = $this->setting->default;
            $this->json['widgets'] = $this->widgets;
            $this->json['placement'] = $this->placement;
            $this->json['related_section'] = $this->related_section;
            $this->json['builder_settings_section'] = $this->builder_settings_section;
            $this->json['responsive_canvas_id'] = $this->responsive_canvas_id;
            $this->json['responsive_section'] = $this->responsive_section;
        }
    }
endif;