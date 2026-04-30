<?php
    /**
     * Base class for header and footer builder
     * 
     * @package Newsmatic Pro
     * @since 1.4.0
     */
    namespace Newsmatic_Builder;
    use Newsmatic\CustomizerDefault as ND;
    if( ! class_exists( 'Header_Builder_Render' ) ) :
        /**
         * Builder Base class
         * 
         * @since 1.4.0
         */
        class Header_Builder_Render extends Builder_Base {
            /**
             * Method that gets called when class is instantiated
             * 
             * @since 1.4.0
             */
            public function __construct() {
                $this->original_value = ND\newsmatic_get_customizer_option( 'header_builder' );
                $this->builder_value = $this->original_value;
                $this->assign_values();
                $this->prepare_value_for_render();
                $this->render();
            }

            /**
             * Assign values
             * 
             * @since 1.4.0
             */
            public function assign_values() {
                /* Columns count */
                $this->columns_array = [ 
                    ND\newsmatic_get_customizer_option( 'header_first_row_column' ),
                    ND\newsmatic_get_customizer_option( 'header_second_row_column' ),
                    ND\newsmatic_get_customizer_option( 'header_third_row_column' )
                ];
                /* Columns layout */
                $this->column_layouts_array = [
                    ND\newsmatic_get_customizer_option( 'header_first_row_column_layout' ),
                    ND\newsmatic_get_customizer_option( 'header_second_row_column_layout' ),
                    ND\newsmatic_get_customizer_option( 'header_third_row_column_layout' )
                ];
                /* Column Alignments */
                $this->column_alignments_array = $this->organize_column_alignments();
            }

            /**
             * Column alignments
             * 
             * @since 1.4.0
             */
            public function organize_column_alignments() {
                $column_alignments = [
                    [
                        /* First Row */
                        ND\newsmatic_get_customizer_option( 'header_first_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'header_first_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'header_first_row_column_three' )
                    ],
                    [
                        /* Second Row */
                        ND\newsmatic_get_customizer_option( 'header_second_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'header_second_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'header_second_row_column_three' )
                    ],
                    [
                        /* Third Row */
                        ND\newsmatic_get_customizer_option( 'header_third_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'header_third_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'header_third_row_column_three' )
                    ]
                ];

                $structured_alignements = [];
                if( count( $this->columns_array ) > 0 ) :
                    $columns_array_count = count( $this->columns_array );
                    for( $i = 0; $i < $columns_array_count; $i++ ) :
                        $structured_alignements[ $i ] = $column_alignments[ $i ];
                    endfor;
                endif;

                return $structured_alignements;
            }

            /**
             * Extra row classes
             * 
             * @since 1.4.0
             */
            public function get_extra_row_classes( $row_index ) {
                $row_widgets = $this->builder_value[ $row_index ];
                $only_widgets = array_reduce( $row_widgets, 'array_merge', [] );
                $classes = '';
                if( in_array( 'menu', $only_widgets ) ) $classes .= ' has-menu';
                $allow_full_width = ND\newsmatic_get_customizer_option( 'header_'. $this->get_ordinals( $row_index + 1 ) .'_row_full_width' );
                if( ! $allow_full_width ) $classes .= ' full-width';
                return $classes;
            }

            /**
             * Extra row wrap classes
             * 
             * @since 1.4.0
             */
            public function get_extra_row_wrap_classes( $row_index ) {
                $classes = '';
                $allow_full_width = ND\newsmatic_get_customizer_option( 'header_'. $this->get_ordinals( $row_index + 1 ) .'_row_full_width' );
                if( $allow_full_width ) $classes .= ' full-width';
                return $classes;
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
                endswitch;
            }
        }
    endif;