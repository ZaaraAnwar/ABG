<?php
/**
 * Section Heading Control
 * 
 * @package Newsmatic Pro
 * @since 1.4.0
 */

if( class_exists( 'WP_Customize_Control' ) ) :
    class Newsmatic_WP_Section_Heading_Toggle_Control extends \WP_Customize_Control {
        /**
         * Control type
         * 
         */
        public $type = 'section-heading-toggle';
        public $tab = 'general';
        public $initial = true;
        
        /**
         * Add custom JSON parameters to use in the JS template.
         *
         * @since  1.4.0
         * @access public
         * @return void
         */
        public function to_json() {
            parent::to_json();
            if( $this->tab ) {
                $this->json['tab'] = $this->tab;
                $this->json['initial'] = $this->initial;
            }
        }

        /**
         * Enqueue scripts/styles.
         *
         * @since 3.4.0
         */
        public function enqueue() {
            wp_enqueue_script( 'newsmatic-customizer-section-heading-toggle', get_template_directory_uri() . '/inc/customizer/custom-controls/section-heading-toggle/control.js', array('jquery'), NEWSMATIC_VERSION, true );
            wp_enqueue_style( 'newsmatic-customizer-section-heading-toggle', get_template_directory_uri() . '/inc/customizer/custom-controls/section-heading-toggle/control.css', array(), NEWSMATIC_VERSION, 'all' );
        }

        // Render the control's content
        public function render_content() {
    ?>
            <div class="customize-section-heading">
                <span class="customize-control-title"><?php echo esc_html( $this->label ); ?></span>
                <span class="toggle-button"><span class="dashicons dashicons-arrow-up-alt2"></span></span>
            </div>
            <?php
        }
    }
endif;