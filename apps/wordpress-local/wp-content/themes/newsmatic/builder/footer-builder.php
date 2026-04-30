<?php
    /**
     * Footer Builder
     * 
     * @package Newsmatic Pro
     * @since 1.4.0
     */
    namespace Newsmatic_Builder;
    // require 'base.php';
    use Newsmatic\CustomizerDefault as ND;
    if( ! class_exists( 'Footer_Builder_Render' ) ) :
        /**
         * Builder Base class
         * 
         * @since 1.4.0
         */
        class Footer_Builder_Render extends Builder_Base {
            /**
             * Method that gets called when class is instantiated
             * 
             * @since 1.4.0
             */
            public function __construct() {
                $this->original_value = ND\newsmatic_get_customizer_option( 'footer_builder' );
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
                /* Column count */
                $footer_first_row_column = ND\newsmatic_get_customizer_option( 'footer_first_row_column' );
                $footer_second_row_column = ND\newsmatic_get_customizer_option( 'footer_second_row_column' );
                $footer_third_row_column = ND\newsmatic_get_customizer_option( 'footer_third_row_column' );
                $this->columns_array = [ $footer_first_row_column, $footer_second_row_column, $footer_third_row_column ];
                /* Columns layout */
                $footer_first_row_column_layout = ND\newsmatic_get_customizer_option( 'footer_first_row_column_layout' );
                $footer_second_row_column_layout = ND\newsmatic_get_customizer_option( 'footer_second_row_column_layout' );
                $footer_third_row_column_layout = ND\newsmatic_get_customizer_option( 'footer_third_row_column_layout' );
                $this->column_layouts_array = [ $footer_first_row_column_layout, $footer_second_row_column_layout, $footer_third_row_column_layout];
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
                        ND\newsmatic_get_customizer_option( 'footer_first_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'footer_first_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'footer_first_row_column_three' ),
                        ND\newsmatic_get_customizer_option( 'footer_first_row_column_four' )
                    ],
                    [
                        /* Second Row */
                        ND\newsmatic_get_customizer_option( 'footer_second_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'footer_second_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'footer_second_row_column_three' ),
                        ND\newsmatic_get_customizer_option( 'footer_second_row_column_four' )
                    ],
                    [
                        /* Third Row */
                        ND\newsmatic_get_customizer_option( 'footer_third_row_column_one' ),
                        ND\newsmatic_get_customizer_option( 'footer_third_row_column_two' ),
                        ND\newsmatic_get_customizer_option( 'footer_third_row_column_three' ),
                        ND\newsmatic_get_customizer_option( 'footer_third_row_column_four' )
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
                $classes .= ' tablet-layout-' . $this->column_layouts_array[ $row_index ]['tablet'];
                $classes .= ' smartphone-layout-' . $this->column_layouts_array[ $row_index ]['smartphone'];
                $allow_full_width = ND\newsmatic_get_customizer_option( 'footer_'. $this->get_ordinals( $row_index + 1 ) .'_row_full_width' );
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
                $allow_full_width = ND\newsmatic_get_customizer_option( 'footer_'. $this->get_ordinals( $row_index + 1 ) .'_row_full_width' );
                if( $allow_full_width ) $classes .= ' full-width';
                return $classes;
            }

            /**
             * Extra column classes
             * 
             * @since 1.4.0
             */
            public function get_extra_column_classes( $row, $column ) {
                $column_alignments = $this->column_alignments_array[ $row ][ $column ];
                $classes = '';
                $classes .= ' tablet-alignment--' . $this->column_alignments_array[ $row ][ $column ][ 'tablet' ];
                $classes .= ' smartphone-alignment--' . $this->column_alignments_array[ $row ][ $column ][ 'smartphone' ];
                return $classes;
            }

            /**
             * Get widget html
             * 
             * @since 1.4.0
             */
            public function get_widget_html( $widget ) {
                require get_template_directory() . '/inc/hooks/bottom-footer-hooks.php';
                require get_template_directory() . '/inc/hooks/footer-hooks.php';
                if( ! $widget ) return;
                switch( $widget ) :
                    case 'logo':
                        /**
                         * hook - newsmaticr_footer_logo_hook
                         * 
                         * @hooked - newsmatic_footer_logo_html - 10
                         */
                        if( has_action( 'newsmaticr_footer_logo_hook' ) ) do_action( 'newsmaticr_footer_logo_hook' );
                        break;
                    case 'social-icons':
                        /**
                         * hook - newsmatic_footer_social_icons_hook
                         * 
                         * @hooked - newsmatic_botttom_footer_social_part - 10
                         */
                        if( has_action( 'newsmatic_footer_social_icons_hook' ) ) do_action( 'newsmatic_footer_social_icons_hook' );
                        break;
                    case 'copyright':
                        /**
                         * hook - newsmatic_copyright_hook
                         * 
                         * @hooked - newsmatic_bottom_footer_copyright_part - 10
                         */
                        if( has_action( 'newsmatic_copyright_hook' ) ) do_action( 'newsmatic_copyright_hook' );
                        break;
                    case 'menu':
                        /**
                         * hook - newsmatic_footer_menu_hook
                         * 
                         * @hooked - newsmatic_bottom_footer_menu_part - 10
                         */
                        if( has_action( 'newsmatic_footer_menu_hook' ) ) do_action( 'newsmatic_footer_menu_hook' );
                        break;
                    case 'sidebar-one':
                        /**
                         * sidebar-id = 'footer-sidebar--column-1'
                         */
                        dynamic_sidebar( 'footer-sidebar--column-1' );
                        break;
                    case 'sidebar-two':
                        /**
                         * sidebar-id = 'footer-sidebar--column-2'
                         */
                        dynamic_sidebar( 'footer-sidebar--column-2' );
                        break;
                    case 'sidebar-three':
                        /**
                         * sidebar-id = 'footer-sidebar--column-3'
                         */
                        dynamic_sidebar( 'footer-sidebar--column-3' );
                        break;
                    case 'sidebar-four':
                        /**
                         * sidebar-id = 'footer-sidebar--column-4'
                         */
                        dynamic_sidebar( 'footer-sidebar--column-4' );
                        break;
                    case 'scroll-to-top':
                         /**
                         * hook - newsmatic_scroll_to_top_hook
                         * 
                         * @hooked - newsmatic_scroll_to_top_html - 10
                         */
                        if( has_action( 'newsmatic_scroll_to_top_hook' ) ) do_action( 'newsmatic_scroll_to_top_hook' );
                        break;
                endswitch;
            }
        }
    endif;