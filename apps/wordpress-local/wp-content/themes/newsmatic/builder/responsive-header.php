<?php
    /**
     * Base class for responsive header builder
     * 
     * @package Newsmatic Pro
     * @since 1.4.0
     */
    namespace Newsmatic_Builder;
    require 'header-builder.php';
    use Newsmatic\CustomizerDefault as ND;
    if( ! class_exists( 'Responsive_Header_Builder_Render' ) ) :
        /**
         * Builder Base class
         * 
         * @since 1.4.0
         */
        class Responsive_Header_Builder_Render extends Header_Builder_Render {
            /**
             * Method that gets called when class is instantiated
             * 
             * @since 1.4.0
             */
            public function __construct() {
                $this->original_value = ND\newsmatic_get_customizer_option( 'responsive_header_builder' );
                $this->builder_value = $this->original_value;
                $this->responsive = 'tablet';
                $this->assign_values();
                $this->prepare_value_for_render();
                $this->render();
            }

            /**
             * Opening div
             * 
             * @since 1.4.0
             */
            protected function opening_div() {
                $wrapperClass = $this->prefix_class . '-responsive';
                echo '<div class="'. esc_attr( $wrapperClass ) .'">';
            }

            /**
             * Get widget html
             * 
             * @since 1.4.0
             */
            public function get_widget_html( $widget ) {
                require get_template_directory() . '/inc/hooks/header-hooks.php';
                if( ! $widget ) return;
                switch( $widget ) :
                    case 'site-logo':
                        /**
                        * hook - newsmatic_site_branding_hook
                        * 
                        * @hooked - newsmatic_header_site_branding_part - 10
                        */
                        if( has_action( 'newsmatic_site_branding_hook' ) ) do_action( 'newsmatic_site_branding_hook' );
                        break;
                    case 'date-time':
                        /**
                        * hook - newsmatic_date_time_hook
                        * 
                        * @hooked - newsmatic_top_header_date_time_part - 10
                        */
                        if( has_action( 'newsmatic_date_time_hook' ) ) do_action( 'newsmatic_date_time_hook' );
                        break;
                    case 'social-icons':
                        /**
                        * hook - newsmatic_header_social_icons_hook
                        * 
                        * @hooked - newsmatic_main_header_social_part - 10
                        */
                        if( has_action( 'newsmatic_header_social_icons_hook' ) ) do_action( 'newsmatic_header_social_icons_hook' );
                        break;
                    case 'search':
                        /**
                         * hook - newsmatic_header_search_hook
                         * 
                         * @hooked - newsmatic_header_search_part - 10
                         */
                        if( has_action( 'newsmatic_header_search_hook' ) ) do_action( 'newsmatic_header_search_hook' );
                        break;
                    case 'menu':
                        /**
                         * hook - newsmatic_primary_menu_hook
                         * 
                         * @hooked - newsmatic_header_menu_part - 10
                         */
                        if( has_action( 'newsmatic_primary_menu_hook' ) ) do_action( 'newsmatic_primary_menu_hook' );
                        break;
                    case 'button':
                        /**
                         * hook - newsmatic_custom_button_hook
                         * 
                         * @hooked - newsmatic_header_custom_button_part - 10
                         */
                        if( has_action( 'newsmatic_custom_button_hook' ) ) do_action( 'newsmatic_custom_button_hook' );
                        break;
                    case 'theme-mode':
                        /**
                         * hook - newsmatic_theme_mode_hook
                         * 
                         * @hooked - newsmatic_header_theme_mode_icon_part - 10
                         */
                        if( has_action( 'newsmatic_theme_mode_hook' ) ) do_action( 'newsmatic_theme_mode_hook' );
                        break;
                    case 'off-canvas':
                        /**
                         * hook - newsmatic_off_canvas_hook
                         * 
                         * @hooked - newsmatic_header_sidebar_toggle_part - 10
                         */
                        if( has_action( 'newsmatic_off_canvas_hook' ) ) do_action( 'newsmatic_off_canvas_hook' );
                        break;
                    case 'image':
                        /**
                         * hook - newsmatic_header_ads_banner_hook
                         * 
                         * @hooked - newsmatic_header_ads_banner_part - 10
                         */
                        if( has_action( 'newsmatic_header_ads_banner_hook' ) ) do_action( 'newsmatic_header_ads_banner_hook' );
                        break;
                    case 'secondary-menu':
                        /**
                         * hook - newsmatic_secondary_menu_hook
                         * 
                         * @hooked - newsmatic_top_header_menu_part - 10
                         */
                        if( has_action( 'newsmatic_secondary_menu_hook' ) ) do_action( 'newsmatic_secondary_menu_hook' );
                        break;
                    case 'newsletter':
                        /**
                         * hook - newsmatic_newsletter_hook
                         * 
                         * @hooked - newsmatic_header_newsletter_part - 10
                         */
                        if( has_action( 'newsmatic_newsletter_hook' ) ) do_action( 'newsmatic_newsletter_hook' );
                        break;
                    case 'random-news':
                        /**
                         * hook - newsmatic_random_news_hook
                         * 
                         * @hooked - newsmatic_header_random_news_part - 10
                         */
                        if( has_action( 'newsmatic_random_news_hook' ) ) do_action( 'newsmatic_random_news_hook' );
                        break;
                    case 'ticker-news':
                        /**
                         * hook - newsmatic_header_ticker_news_hook
                         * 
                         * @hooked - newsmatic_top_header_ticker_news_part - 10
                         */
                        if( has_action( 'newsmatic_header_ticker_news_hook' ) ) do_action( 'newsmatic_header_ticker_news_hook' );
                        break;
                    case 'widget-area':
                        /**
                         * sidebar-id = 'header-builder-widget-area'
                         */
                        dynamic_sidebar( 'header-builder-widget-area' );
                        break;
                    case 'toggle-button':
                        /**
                         * Function - newsmatic_get_toggle_button_html
                         */
                        return newsmatic_get_toggle_button_html();
                        break;
                endswitch;
            }

            /**
             * Mobile canvas
             * 
             * @since 1.4.0
             */
            public function get_mobile_canvas() {
                $rowClass = $this->prefix_class . 'row';
                $rowClass .= ' mobile-canvas';
                $responsive_header_builder = ND\newsmatic_get_customizer_option( 'responsive_header_builder' );
                $mobile_canvas_alignment = ND\newsmatic_get_customizer_option( 'mobile_canvas_alignment' );
                $rowClass .= ' alignment--' . $mobile_canvas_alignment;
                $canvas = $responsive_header_builder['responsive-canvas'];
                $only_widgets = array_reduce( $this->original_value, 'array_merge', [] );
                if( ! in_array( 'toggle-button', $only_widgets ) ) return;
                ?>
                    <div class="<?php echo esc_attr( $rowClass ); ?>">
                        <?php
                            if( ! empty( $canvas ) && is_array( $canvas ) ) :
                                foreach( $canvas as $widget_index => $widget ) :
                                    $this->render_widget( $widget, $widget_index );
                                endforeach;
                            endif;
                        ?>
                    </div>
                <?php
            }
        }
    endif;