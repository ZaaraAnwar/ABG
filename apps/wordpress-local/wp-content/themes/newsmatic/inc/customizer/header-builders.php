<?php
/**
 * Header Builders Customizer Options
 * 
 * @since 1.4.0
 * @package Newsmatic Pro
 */
use Newsmatic\CustomizerDefault as ND;
if( ! function_exists( 'newsmatic_header_builders_customizer_options' ) ) :
    /**
     * MARK: Header Builders
     */
    function newsmatic_header_builders_customizer_options( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'header_builder_section', [
            'title' => esc_html__( 'Header Builder', 'newsmatic' ),
            'active_callback'   =>  function(){ return false; }
        ]);

        $wp_customize->add_setting( 'header_builder', [
            'sanitize_callback' => 'newsmatic_sanitize_builder_control',
            'default'   => ND\newsmatic_get_customizer_default( 'header_builder' )
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Control( $wp_customize, 'header_builder', [
            'section'     => NEWSMATIC_PREFIX . 'header_builder_section',
            'builder_settings_section'	=>	'newsmatic_header_builder_section_settings',
            'responsive_builder'	=>	'responsive_header_builder',
            'widgets'	=>	[
                'site-logo'	=>	[
                    'label' 	=>	esc_html__( 'Site Logo and Title', 'newsmatic' ),
                    'icon' 	=>	'admin-site',
                    'section'	=>	'title_tagline'
                ],
                'date-time'	=>	[
                    'label' 	=>	esc_html__( 'Date Time', 'newsmatic' ),
                    'icon' 	=>	'clock',
                    'section'	=>  NEWSMATIC_PREFIX . 'date_time_section'
                ],
                'newsletter'	=>	[
                    'label' 	=>	esc_html__( 'Newsletter / Subscribe Button', 'newsmatic' ),
                    'icon' 	=>	'megaphone',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_newsletter_section'
                ],
                'social-icons'	=>	[
                    'label' 	=>	esc_html__( 'Social Icons', 'newsmatic' ),
                    'icon' 	=>	'networking',
                    'section'	=>	NEWSMATIC_PREFIX . 'social_icons_section'
                ],
                'search'	=>	[
                    'label' 	=>	esc_html__( 'Search', 'newsmatic' ),
                    'icon' 	=>	'search',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_live_search_section'
                ],
                'menu'	=>	[
                    'label' 	=>	esc_html__( 'Primary Menu', 'newsmatic' ),
                    'icon' 	=>	'menu',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_menu_option_section'
                ],
                'button'	=>	[
                    'label' 	=>	esc_html__( 'Button', 'newsmatic' ),
                    'icon' 	=>	'button',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_custom_button_section'
                ],
                'theme-mode'	=>	[
                    'label' 	=>	esc_html__( 'Theme Mode', 'newsmatic' ),
                    'icon' 	=>	'lightbulb',
                    'section'	=>	NEWSMATIC_PREFIX . 'theme_mode_section'
                ],
                'off-canvas'	=>	[
                    'label' 	=>	esc_html__( 'Off Canvas', 'newsmatic' ),
                    'icon' 	=>	'text-page',
                    'section'	=>	NEWSMATIC_PREFIX . 'canvas_menu_section'
                ],
                'image'	=>	[
                    'label' 	=>	esc_html__( 'Image', 'newsmatic' ),
                    'icon' 	=>	'format-image',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_ads_banner_section'
                ],
                'random-news'	=>	[
                    'label' 	=>	esc_html__( 'Random News', 'newsmatic' ),
                    'icon' 	=>	'randomize',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_random_news_section'
                ],
                'secondary-menu'	=>	[
                    'label' 	=>	esc_html__( 'Secondary Menu', 'newsmatic' ),
                    'icon' 	=>	'menu-alt2',
                    'section'	=>	NEWSMATIC_PREFIX . 'secondary_menu_section'
                ],
                'ticker-news'	=>	[
                    'label' 	=>	esc_html__( 'Ticker news', 'newsmatic' ),
                    'icon' 	=>	'slides',
                    'section'	=>	NEWSMATIC_PREFIX . 'ticker_news_section'
                ],
                'widget-area'	=>	[
                    'label' 	=>	esc_html__( 'Widget Area', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-header-builder-widget-area'
                ]
            ]
        ]));

        $wp_customize->add_setting( 'responsive_header_builder', [
            'sanitize_callback' => 'newsmatic_sanitize_builder_control',
            'default'   => ND\newsmatic_get_customizer_default( 'responsive_header_builder' )
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Builder_Control( $wp_customize, 'responsive_header_builder', [
            'section'     => NEWSMATIC_PREFIX . 'header_builder_section',
            'builder_settings_section'	=>	'newsmatic_header_builder_section_settings',
            'placement'	=>	'header',
            'responsive_canvas_id'	=>	'responsive-canvas',
            'responsive_section'	=>	'newsmatic_mobile_canvas_section',
            'widgets'	=>	[
                'site-logo'	=>	[
                    'label' 	=>	esc_html__( 'Site Logo and Title', 'newsmatic' ),
                    'icon' 	=>	'admin-site',
                    'section'	=>	'title_tagline'
                ],
                'date-time'	=>	[
                    'label' 	=>	esc_html__( 'Date Time', 'newsmatic' ),
                    'icon' 	=>	'clock',
                    'section'	=>	NEWSMATIC_PREFIX . 'date_time_section'
                ],
                'newsletter'	=>	[
                    'label' 	=>	esc_html__( 'Newsletter / Subscribe Button', 'newsmatic' ),
                    'icon' 	=>	'megaphone',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_newsletter_section'
                ],
                'social-icons'	=>	[
                    'label' 	=>	esc_html__( 'Social Icons', 'newsmatic' ),
                    'icon' 	=>	'networking',
                    'section'	=>	NEWSMATIC_PREFIX . 'social_icons_section'
                ],
                'search'	=>	[
                    'label' 	=>	esc_html__( 'Search', 'newsmatic' ),
                    'icon' 	=>	'search',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_live_search_section'
                ],
                'menu'	=>	[
                    'label' 	=>	esc_html__( 'Primary Menu', 'newsmatic' ),
                    'icon' 	=>	'menu',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_menu_option_section'
                ],
                'button'	=>	[
                    'label' 	=>	esc_html__( 'Button', 'newsmatic' ),
                    'icon' 	=>	'button',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_custom_button_section'
                ],
                'theme-mode'	=>	[
                    'label' 	=>	esc_html__( 'Theme Mode', 'newsmatic' ),
                    'icon' 	=>	'lightbulb',
                    'section'	=>	NEWSMATIC_PREFIX . 'theme_mode_section'
                ],
                'off-canvas'	=>	[
                    'label' 	=>	esc_html__( 'Off Canvas', 'newsmatic' ),
                    'icon' 	=>	'text-page',
                    'section'	=>	NEWSMATIC_PREFIX . 'canvas_menu_section'
                ],
                'image'	=>	[
                    'label' 	=>	esc_html__( 'Image', 'newsmatic' ),
                    'icon' 	=>	'format-image',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_ads_banner_section'
                ],
                'random-news'	=>	[
                    'label' 	=>	esc_html__( 'Random News', 'newsmatic' ),
                    'icon' 	=>	'randomize',
                    'section'	=>	NEWSMATIC_PREFIX . 'header_random_news_section'
                ],
                'toggle-button'	=>	[
                    'label' 	=>	esc_html__( 'Toggle Button', 'newsmatic' ),
                    'icon' 	=>	'ellipsis',
                    'section'	=>	NEWSMATIC_PREFIX . 'mobile_canvas_section'
                ],
                'secondary-menu'	=>	[
                    'label' 	=>	esc_html__( 'Secondary Menu', 'newsmatic' ),
                    'icon' 	=>	'menu-alt2',
                    'section'	=>	NEWSMATIC_PREFIX . 'secondary_menu_section'
                ],
                'ticker-news'	=>	[
                    'label' 	=>	esc_html__( 'Ticker news', 'newsmatic' ),
                    'icon' 	=>	'slides',
                    'section'	=>	NEWSMATIC_PREFIX . 'ticker_news_section'
                ],
                'widget-area'	=>	[
                    'label' 	=>	esc_html__( 'Widget Area', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-header-builder-widget-area'
                ]
            ]
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_builders_customizer_options' );
endif;

if( ! function_exists( 'newsmatic_header_builder_settings' )  ) :
    /**
     * MARK: Header Builder Settings
     */
    function newsmatic_header_builder_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'header_builder_section_settings', [
            'title' =>  esc_html__( 'Header Builder', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'header_builder_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_builder_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'header_builder_section_settings',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_width_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_width_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_select_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'header_width_layout', [
            'label'     =>  __( 'Width Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'priority'  =>  10,
            'choices'   =>  [
                'contain'   =>  [
                    'label' =>  esc_html__( 'Boxed', 'newsmatic' ),
                    'url'   =>  '%s/assets/images/customizer/boxed-width.png'
                ],
                'full-width'   => [
                    'label' =>  esc_html__( 'Full Width', 'newsmatic' ),
                    'url'   =>  '%s/assets/images/customizer/full-width.png'
                ]
            ]
        ]));

        $wp_customize->add_setting( 'theme_header_sticky', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'theme_header_sticky' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'theme_header_sticky', [
            'label' =>  esc_html__( 'Enable header section sticky', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings'
        ]));

        $wp_customize->add_setting( 'header_first_row_header_sticky', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_header_sticky' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_first_row_header_sticky', [
            'label' =>  esc_html__( 'Enable Header Sticky in 1st Row', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'active_callback'   =>  function( $setting ) {
                return $setting->manager->get_setting( 'theme_header_sticky' )->value();
            }
        ]));

        $wp_customize->add_setting( 'header_second_row_header_sticky', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_header_sticky' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_second_row_header_sticky', [
            'label' =>  esc_html__( 'Enable Header Sticky in 2nd Row', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'active_callback'   =>  function( $setting ) {
                return $setting->manager->get_setting( 'theme_header_sticky' )->value();
            }
        ]));

        $wp_customize->add_setting( 'header_third_row_header_sticky', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_header_sticky' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_third_row_header_sticky', [
            'label' =>  esc_html__( 'Enable Header Sticky in 3rd Row', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'active_callback'   =>  function( $setting ) {
                return $setting->manager->get_setting( 'theme_header_sticky' )->value();
            }
        ]));

        $wp_customize->add_setting( 'header_builder_border', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_builder_border' ),
            'sanitize_callback' =>  'newsmatic_sanitize_array',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'header_builder_border', [
            'label' =>  esc_html__( 'Border', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'header_builder_box_shadow', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_builder_box_shadow' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'newsmatic_sanitize_box_shadow_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Box_Shadow_Control( $wp_customize, 'header_builder_box_shadow', [
            'label' =>  esc_html__( 'Box Shadow', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'header_builder_section_settings',
            'tab'   =>  'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_builder_settings' );
endif;

if( ! function_exists( 'newsmatic_header_builder_first_row_settings' ) ) :
    /**
     * MARK: Header Builder First Row
     */
    function newsmatic_header_builder_first_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'header_first_row', [
            'title' => esc_html__( 'Header First Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'header_first_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_first_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'header_first_row',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ],
                [
                    'name'  =>  'column',
                    'title' =>  esc_html__( 'Column', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_first_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'header_first_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => 'newsmatic_header_first_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  3,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'header_first_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'header_first_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_first_row',
            'choices'   =>  newsmatic_get_header_builder_layouts(),
            'row'   =>  1
        ]));

        $wp_customize->add_setting( 'header_first_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'header_first_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_first_row',
            'placement'	=>	'header',
            'builder'	=>	'header_builder',
            'row'	=>	1,
            'responsive'    =>  'responsive-header',
            'responsive_builder_id' =>  'responsive_header_builder'
        ]));

        $wp_customize->add_setting( 'header_first_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_first_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_first_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'top_header_background_color_group', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'top_header_background_color_group' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Control( $wp_customize, 'top_header_background_color_group', [
            'label' =>  esc_html__( 'Background', 'newsmatic' ),
            'section'   =>  'newsmatic_header_first_row',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'top_header_bottom_border', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'top_header_bottom_border' ),
            'sanitize_callback' =>  'newsmatic_sanitize_array',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'top_header_bottom_border', [
            'label' =>  esc_html__( 'Border Bottom', 'newsmatic' ),
            'section'   =>  'newsmatic_header_first_row',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'header_first_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'header_first_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'header_first_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => 'newsmatic_header_first_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'header_first_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_first_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_first_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_first_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_first_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_first_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_first_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_first_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_first_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_first_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_first_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_first_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_first_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_builder_first_row_settings' );
endif;

if( ! function_exists( 'newsmatic_header_builder_second_row_settings' ) ) :
    /**
     * MARK: Header Builder Second Row
     */
    function newsmatic_header_builder_second_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'header_second_row', [
            'title' =>  esc_html__( 'Header Second Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'header_second_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_second_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'header_second_row',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ],
                [
                    'name'  =>  'column',
                    'title' =>  esc_html__( 'Column', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_second_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'header_second_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => 'newsmatic_header_second_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  3,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'header_second_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'header_second_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_second_row',
            'choices'   =>  newsmatic_get_header_builder_layouts(),
            'row'   =>  2
        ]));

        $wp_customize->add_setting( 'header_second_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'header_second_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_second_row',
            'placement'	=>	'header',
            'builder'	=>	'header_builder',
            'row'	=>	2,
            'responsive'    =>  'responsive-header',
            'responsive_builder_id' =>  'responsive_header_builder'
        ]));

        $wp_customize->add_setting( 'header_second_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_second_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_second_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'header_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_background_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_image_group_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Image_Group_Control( $wp_customize, 'header_background_color_group', [
            'label'	      => esc_html__( 'Background', 'newsmatic' ),
            'section'     => 'newsmatic_header_second_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_menu_top_border', [
            'default' => ND\newsmatic_get_customizer_default( 'header_menu_top_border' ),
            'sanitize_callback' => 'newsmatic_sanitize_array',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'header_menu_top_border', [
            'label'       => esc_html__( 'Border Bottom', 'newsmatic' ),
            'section'     => 'newsmatic_header_second_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_second_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'header_second_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'header_second_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => 'newsmatic_header_second_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'header_second_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_second_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_second_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_second_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_second_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_second_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_second_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_second_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_second_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_second_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_second_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_second_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_second_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_builder_second_row_settings' );
endif;

if( ! function_exists( 'newsmatic_header_builder_third_row_settings' ) ) :
    /**
     * MARK: Header Builder Third Row
     */
    function newsmatic_header_builder_third_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'header_third_row', [
            'title' =>  esc_html__( 'Header Third Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'header_third_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_third_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'header_third_row',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ],
                [
                    'name'  =>  'column',
                    'title' =>  esc_html__( 'Column', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_third_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'header_third_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => 'newsmatic_header_third_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  3,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'header_third_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'header_third_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_third_row',
            'choices'   =>  newsmatic_get_header_builder_layouts(),
            'row'   =>  3
        ]));

        $wp_customize->add_setting( 'header_third_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'header_third_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_third_row',
            'placement'	=>	'header',
            'builder'	=>	'header_builder',
            'row'	=>	3,
            'responsive'    =>  'responsive-header',
            'responsive_builder_id' =>  'responsive_header_builder'
        ]));

        $wp_customize->add_setting( 'header_third_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'header_third_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_third_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'header_menu_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_menu_background_color_group' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Control( $wp_customize, 'header_menu_background_color_group', [
            'label'	      => esc_html__( 'Background', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'header_third_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_menu_bottom_border', [
            'default' => ND\newsmatic_get_customizer_default( 'header_menu_bottom_border' ),
            'sanitize_callback' => 'newsmatic_sanitize_array',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'header_menu_bottom_border', [
            'label'       => esc_html__( 'Border Bottom', 'newsmatic' ),
            'section'     => 'newsmatic_header_third_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_third_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'header_third_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'header_third_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => 'newsmatic_header_third_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'header_third_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_third_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_third_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_third_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_third_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_third_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_third_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_third_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
        
        $wp_customize->add_setting( 'header_third_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'header_third_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'header_third_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'header_third_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => 'newsmatic_header_third_row',
            'tab'   =>  'column',
            'choices' => [
                [
                    'value' => 'left',
                    'icon'  =>  'editor-alignleft',
                    'label' =>  esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'icon'  =>  'editor-aligncenter',
                    'label' =>  esc_html__( 'Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'icon'  =>  'editor-alignright',
                    'label' =>  esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_builder_third_row_settings' );
endif;

if( ! function_exists( 'newsmatic_mobile_canvas_section_settings' ) ) :
    /**
     * MARK: Header Builder Third Row
     */
    function newsmatic_mobile_canvas_section_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'mobile_canvas_section', [
            'title' =>  esc_html__( 'Mobile Canvas', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'mobile_canvas_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'mobile_canvas_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'mobile_canvas_section',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'mobile_canvas_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'mobile_canvas_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  'newsmatic_mobile_canvas_section',
            'placement'	=>	'responsive-header',
            'builder'	=>	'responsive_header_builder',
            'row'	=>	4
        ]));

        $wp_customize->add_setting( 'mobile_canvas_alignment', [
            'default' => ND\newsmatic_get_customizer_default( 'mobile_canvas_alignment' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'mobile_canvas_alignment', [
            'label'	      => esc_html__( 'Alignment', 'newsmatic' ),
            'section'     => 'newsmatic_mobile_canvas_section',
            'choices' => [
                [
                    'value' => 'left',
                    'label' => esc_html__( 'Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'label' => esc_html__( 'Right', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'label' => esc_html__( 'Right', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'mobile_canvas_icon_color', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'mobile_canvas_icon_color' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'mobile_canvas_icon_color', [
            'label' =>  esc_html__( 'Icon Color', 'newsmatic' ),
            'section'   =>  'newsmatic_mobile_canvas_section',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'mobile_canvas_text_color', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'mobile_canvas_text_color' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'mobile_canvas_text_color', [
            'label' =>  esc_html__( 'Text Color', 'newsmatic' ),
            'section'   =>  'newsmatic_mobile_canvas_section',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'mobile_canvas_background', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'mobile_canvas_background' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'newsmatic_sanitize_color_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Picker_Control( $wp_customize, 'mobile_canvas_background', [
            'label' =>  esc_html__( 'Background', 'newsmatic' ),
            'section'   =>  'newsmatic_mobile_canvas_section',
            'tab'   =>  'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_mobile_canvas_section_settings' );
endif;

if( ! function_exists( 'newsmatic_date_time_section_settings' ) ) :
    /**
     * MARK: Header Builder Third Row
     */
    function newsmatic_date_time_section_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'date_time_section', [
            'title' =>  esc_html__( 'Date & Time', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'date_time_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'date_time_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'date_time_section',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'date_option', [
            'default'   => ND\newsmatic_get_customizer_default( 'date_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'date_option', [
            'label'	      => esc_html__( 'Show Date', 'newsmatic' ),
            'section'     => 'newsmatic_date_time_section'
        ]));

        $wp_customize->add_setting( 'time_option', [
            'default'   => ND\newsmatic_get_customizer_default( 'time_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'time_option', [
            'label'	      => esc_html__( 'Show Time', 'newsmatic' ),
            'section'     => 'newsmatic_date_time_section'
        ]));

        $wp_customize->add_setting( 'date_time_display_block', [
            'default'   => ND\newsmatic_get_customizer_default( 'date_time_display_block' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'date_time_display_block', [
            'label' =>  esc_html__( 'Display Block', 'newsmatic' ),
            'description'   =>  esc_html__( 'Show date and time in different lines.', 'newsmatic' ),
            'section'   =>  'newsmatic_date_time_section'
        ]));

        $wp_customize->add_setting( 'top_header_datetime_color', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'top_header_datetime_color' ),
            'transport' =>  'postMessage',
            'sanitize_callback' =>  'newsmatic_sanitize_color_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Picker_Control( $wp_customize, 'top_header_datetime_color', [
            'label' =>  esc_html__( 'Date/Time Color', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'date_time_section',
            'tab'   =>  'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_date_time_section_settings' );
endif;

if( ! function_exists( 'newsmatic_newsletter_section_settings' ) ) :
    /**
     * MARK: Newsletter Section
     */
    function newsmatic_newsletter_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_newsletter_section', [
            'title' => esc_html__( 'Newsletter / Subscribe Button', 'newsmatic' ),
        ]);

        $wp_customize->add_setting( 'newsletter_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsletter_section_tab', [
            'section'   =>  'newsmatic_header_newsletter_section',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_newsletter_label', [
            'default' => ND\newsmatic_get_customizer_default( 'header_newsletter_label' ),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'header_newsletter_label', [
            'label'     => esc_html__( 'Button Label', 'newsmatic' ),
            'section'     => 'newsmatic_header_newsletter_section',
            'settings'    => 'header_newsletter_label',
            'icons' => [ "fas fa-ban", "far fa-envelope", "fas fa-mail-bulk", "fas fa-envelope", "fas fa-thumbs-up", "far fa-thumbs-up" ]
        ]));

        $wp_customize->add_setting( 'header_newsletter_redirect_href_link', [
            'default' => ND\newsmatic_get_customizer_default( 'header_newsletter_redirect_href_link' ),
            'sanitize_callback' => 'newsmatic_sanitize_url',
        ]);
        $wp_customize->add_control( 'header_newsletter_redirect_href_link', [
            'label' => esc_html__( 'Redirect URL.', 'newsmatic' ),
            'description'   => esc_html__( 'Add url for the button to redirect.', 'newsmatic' ),
            'section'   => 'newsmatic_header_newsletter_section',
            'type'  => 'url'
        ]);

        $wp_customize->add_setting( 'header_newsletter_label_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_newsletter_label_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_newsletter_label_color', [
            'label'	      => esc_html__( 'Label Color', 'newsmatic' ),
            'section'     => 'newsmatic_header_newsletter_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_newsletter_section_settings' );
endif;

if( ! function_exists( 'newsmatic_header_social_icons_section_settings' ) ) :
    /**
     * MARK: Social Icons
     */
    function newsmatic_header_social_icons_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_social_icons_section', [
            'title' => esc_html__( 'Social Icons', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'header_social_icons_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_social_icons_section_tab', [
            'section'   =>  'newsmatic_social_icons_section',
            'priority'  =>  1,
            'choices'   =>  [
                [
                    'name'  =>  'general',
                    'title' =>  esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  =>  'design',
                    'title' =>  esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'social_icons_target', [
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'social_icons_target' ),
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( 'social_icons_target', [
            'type'      => 'select',
            'section'   => 'newsmatic_social_icons_section',
            'label'     => esc_html__( 'Social Icon Link Open in', 'newsmatic' ),
            'description' => esc_html__( 'Sets the target attribute according to the value.', 'newsmatic' ),
            'choices'   => [
                '_blank' => esc_html__( 'Open link in new tab', 'newsmatic' ),
                '_self'  => esc_html__( 'Open link in same tab', 'newsmatic' )
            ]
        ]);

        $wp_customize->add_setting( 'social_icons', [
            'default'   => ND\newsmatic_get_customizer_default( 'social_icons' ),
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Custom_Repeater( $wp_customize, 'social_icons', [
            'label'         => esc_html__( 'Social Icons', 'newsmatic' ),
            'description'   => esc_html__( 'Hold bar icon and drag vertically to re-order the icons', 'newsmatic' ),
            'section'       => 'newsmatic_social_icons_section',
            'settings'      => 'social_icons',
            'row_label'     => 'inherit-icon_class',
            'add_new_label' => esc_html__( 'Add New Icon', 'newsmatic' ),
            'fields'        => [
                'icon_class'   => [
                    'type'          => 'fontawesome-icon-picker',
                    'label'         => esc_html__( 'Social Icon', 'newsmatic' ),
                    'description'   => esc_html__( 'Select from dropdown.', 'newsmatic' ),
                    'default'       => esc_attr( 'fab fa-instagram' )
                ],
                'icon_url'  => [
                    'type'      => 'url',
                    'label'     => esc_html__( 'URL for icon', 'newsmatic' ),
                    'default'   => ''
                ],
                'item_option'             => 'show'
            ]
        ]));

        $wp_customize->add_setting( 'top_header_social_icon_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'top_header_social_icon_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'top_header_social_icon_color', [
            'label'	      => esc_html__( 'Social Icon Color', 'newsmatic' ),
            'section'     => 'newsmatic_social_icons_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_header_social_icons_section_settings' );
endif;

if( ! function_exists( 'newsmatic_search_section_settings' ) ) :
    /**
     * MARK: Live Search Section
     */
    function newsmatic_search_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_live_search_section', [
            'title' => esc_html__( 'Live Search', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'header_search_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'header_search_section_tab', [
            'section'     => 'newsmatic_header_live_search_section',
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'theme_header_live_search_option', [
            'default'   => ND\newsmatic_get_customizer_default( 'theme_header_live_search_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Toggle_Control( $wp_customize, 'theme_header_live_search_option', [
            'label'	      => esc_html__( 'Enable live search', 'newsmatic' ),
            'section'     => 'newsmatic_header_live_search_section'
        ]));

        $wp_customize->add_setting( 'header_search_icon_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_search_icon_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_search_icon_color', [
            'label'	      => esc_html__( 'Search Icon Color', 'newsmatic' ),
            'section'     => 'newsmatic_header_live_search_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_search_section_settings' );
endif;

if( ! function_exists( 'newsmatic_primary_menu_section_settings' ) ) :
    /**
     * MARK: Menu Options Section
     */
    function newsmatic_primary_menu_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_menu_option_section', [
            'title' => esc_html__( 'Menu Options', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'header_menu_hover_effect', [
            'default' => ND\newsmatic_get_customizer_default( 'header_menu_hover_effect' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'header_menu_hover_effect', [
            'label'	      => esc_html__( 'Hover Effect', 'newsmatic' ),
            'section'     => 'newsmatic_header_menu_option_section',
            'tab'   =>  'design',
            'choices' => [
                [
                    'value' => 'none',
                    'label' => esc_html__('None', 'newsmatic' )
                ],
                [
                    'value' => 'one',
                    'label' => esc_html__('One', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_menu_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_menu_color' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_menu_color', [
            'label'     => esc_html__( 'Text Color', 'newsmatic' ),
            'section'   => 'newsmatic_header_menu_option_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_primary_menu_section_settings' );
endif;

if( ! function_exists( 'newsmatic_custom_button_section_settings' ) ) :
    /**
     * MARK: Custom Button Section
     */
    function newsmatic_custom_button_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_custom_button_section', [
            'title' => esc_html__( 'Custom Button', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_header_custom_button_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsmatic_header_custom_button_section_tab', [
            'section'     => 'newsmatic_header_custom_button_section',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'custom_button_make_absolute', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'custom_button_make_absolute' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'custom_button_make_absolute', [
            'label' =>  esc_html__( 'Make absolute', 'newsmatic' ),
            'description'   =>  esc_html__( 'When enabled, the position will be absolute.', 'newsmatic' ),
            'section'   =>  'newsmatic_header_custom_button_section'
        ]));

        $wp_customize->add_setting( 'header_custom_button_label', [
            'default' => ND\newsmatic_get_customizer_default( 'header_custom_button_label' ),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'header_custom_button_label', [
            'label'     => esc_html__( 'Button Label', 'newsmatic' ),
            'section'     => 'newsmatic_header_custom_button_section',
            'icons' => [ "fas fa-ban", "fab fa-youtube", "fab fa-youtube-square", "fas fa-film", "fas fa-record-vinyl", "fas fa-volume-up", "fas fa-circle", "far fa-circle", "fab fa-vimeo", "fab fa-vimeo-v", "fas fa-podcast" ]
        ]));

        $wp_customize->add_setting( 'header_custom_button_redirect_href_link', [
            'default' => ND\newsmatic_get_customizer_default( 'header_custom_button_redirect_href_link' ),
            'sanitize_callback' => 'newsmatic_sanitize_url',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( 'header_custom_button_redirect_href_link', [
            'label' => esc_html__( 'Redirect URL.', 'newsmatic' ),
            'description'   => esc_html__( 'Add url for the button to redirect.', 'newsmatic' ),
            'section'   => 'newsmatic_header_custom_button_section',
            'type'  => 'url'
        ]);

        $wp_customize->add_setting( 'header_custom_button_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_custom_button_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_custom_button_color_group', [
            'label'     => esc_html__( 'Icon / Text Color', 'newsmatic' ),
            'section'   => 'newsmatic_header_custom_button_section',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_custom_button_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_custom_button_background_color_group' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Control( $wp_customize, 'header_custom_button_background_color_group', [
            'label'	      => esc_html__( 'Background', 'newsmatic' ),
            'section'     => 'newsmatic_header_custom_button_section',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'header_custom_button_background_hover_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_custom_button_background_hover_color_group' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Control( $wp_customize, 'header_custom_button_background_hover_color_group', [
            'label'	      => esc_html__( 'Background Hover', 'newsmatic' ),
            'section'     => 'newsmatic_header_custom_button_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_custom_button_section_settings' );
endif;

if( ! function_exists( 'newsmatic_theme_mode_section_settings' ) ) :
    /**
     * MARK: Theme Mode Section
     */
    function newsmatic_theme_mode_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_theme_mode_section', [
            'title' => esc_html__( 'Theme Mode', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_theme_mode_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsmatic_theme_mode_section_tab', [
            'section'     => 'newsmatic_theme_mode_section',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'theme_default_mode', [
            'default' => ND\newsmatic_get_customizer_default( 'theme_default_mode' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'theme_default_mode', [
            'label' =>  esc_html__( 'Default Theme Mode', 'newsmatic' ),
            'section'   =>  'newsmatic_theme_mode_section',
            'settings'  =>  'theme_default_mode',
            'choices'   =>  [
                [
                    'value' => 'light',
                    'label' => esc_html__('Light', 'newsmatic' )
                ],
                [
                    'value' => 'dark',
                    'label' => esc_html__('Dark', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'light_mode_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'light_mode_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'light_mode_color', [
            'label'	      => esc_html__( 'Light Color', 'newsmatic' ),
            'section'     => 'newsmatic_theme_mode_section',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'dark_mode_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'dark_mode_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'dark_mode_color', [
            'label'	      => esc_html__( 'Dark Color', 'newsmatic' ),
            'section'     => 'newsmatic_theme_mode_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_theme_mode_section_settings' );
endif;

if( ! function_exists( 'newsmatic_canvas_menu_section_settings' ) ) :
    /**
     * MARK: Off Canvas Section
     */
    function newsmatic_canvas_menu_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_canvas_menu_section', [
            'title' => esc_html__( 'Off Canvas', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_off_canvas_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsmatic_off_canvas_section_tab', [
            'section'     => 'newsmatic_canvas_menu_section',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'off_canvas_position', [
            'default' => ND\newsmatic_get_customizer_default( 'off_canvas_position' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'off_canvas_position', [
            'label'	      => esc_html__( 'Canvas Position', 'newsmatic' ),
            'section'     => 'newsmatic_canvas_menu_section',
            'choices' => [
                [
                    'value' => 'left',
                    'label' => esc_html__('Left', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'label' => esc_html__('Right', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_sidebar_toggle_button_redirects', [
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Redirect_Control( $wp_customize, 'header_sidebar_toggle_button_redirects', [
            'section'     => 'newsmatic_canvas_menu_section',
            'choices'     => [
                'header-social-icons' => [
                    'type'  => 'section',
                    'id'    => 'sidebar-widgets-header-toggle-sidebar',
                    'label' => esc_html__( 'Manage sidebar from here', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_sidebar_toggle_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_sidebar_toggle_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_sidebar_toggle_color', [
            'label'	      => esc_html__( 'Toggle Bar Color', 'newsmatic' ),
            'section'     => 'newsmatic_canvas_menu_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_canvas_menu_section_settings' );
endif;

if( ! function_exists( 'newsmatic_header_ads_banner_section_settings' ) ) :
    /**
     * MARK: Ads Banner Section
     */
    function newsmatic_header_ads_banner_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_ads_banner_section', [
            'title' => esc_html__( 'Ads Banner', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_header_ads_banner_header', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'newsmatic_header_ads_banner_header', [
            'label'	      => esc_html__( 'Ads Banner Setting', 'newsmatic' ),
            'section'     => 'newsmatic_header_ads_banner_section'
        ]));

        $wp_customize->add_setting( 'use_ad_outside_of_header', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'use_ad_outside_of_header' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'use_ad_outside_of_header', [
            'label' =>  esc_html__( 'Use ad outside of header', 'newsmatic' ),
            'section'   =>  'newsmatic_header_ads_banner_section'
        ]));

        $wp_customize->add_setting( 'header_ads_banner_responsive_option', [
            'default' => ND\newsmatic_get_customizer_default( 'header_ads_banner_responsive_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_multiselect_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Multiselect_Tab_Control( $wp_customize, 'header_ads_banner_responsive_option', [
            'label'	      => esc_html__( 'Ads Banner Visibility', 'newsmatic' ),
            'section'     => 'newsmatic_header_ads_banner_section'
        ]));

        $wp_customize->add_setting( 'header_ads_banner_custom_image', [
            'default' => ND\newsmatic_get_customizer_default( 'header_ads_banner_custom_image' ),
            'sanitize_callback' => 'absint',
        ]);
        $wp_customize->add_control( new WP_Customize_Media_Control( $wp_customize, 'header_ads_banner_custom_image', [
            'section' => 'newsmatic_header_ads_banner_section',
            'mime_type' => 'image',
            'label' => esc_html__( 'Ads Image', 'newsmatic' ),
            'description' => esc_html__( 'Recommended size for ad image is 900 (width) * 350 (height)', 'newsmatic' )
        ]));

        $wp_customize->add_setting( 'header_ads_banner_custom_url', [
            'default' => ND\newsmatic_get_customizer_default( 'header_ads_banner_custom_url' ),
            'sanitize_callback' => 'esc_url_raw',
        ]);
        $wp_customize->add_control( 'header_ads_banner_custom_url', [
            'type'  => 'url',
            'section'   => 'newsmatic_header_ads_banner_section',
            'label'     => esc_html__( 'Ads url', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'header_ads_banner_custom_target', [
            'default' => ND\newsmatic_get_customizer_default( 'header_ads_banner_custom_target' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control'
        ]);        
        $wp_customize->add_control( 'header_ads_banner_custom_target', [
            'type'      => 'select',
            'section'   => 'newsmatic_header_ads_banner_section',
            'label'     => __( 'Open Ads link on', 'newsmatic' ),
            'choices'   => [
                '_self' => esc_html__( 'Open in same tab', 'newsmatic' ),
                '_blank' => esc_html__( 'Open in new tab', 'newsmatic' )
            ]
        ]);
    }
    add_action( 'customize_register', 'newsmatic_header_ads_banner_section_settings' );
endif;

if( ! function_exists( 'newsmatic_random_news_section_settings' ) ) :
    /**
     * MARK: Random News Section
     */
    function newsmatic_random_news_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_header_random_news_section', [
            'title' => esc_html__( 'Random News', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_random_news_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsmatic_random_news_section_tab', [
            'section'     => 'newsmatic_header_random_news_section',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'header_random_news_label', [
            'default' => ND\newsmatic_get_customizer_default( 'header_random_news_label' ),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'header_random_news_label', [
            'label'     => esc_html__( 'Button Label', 'newsmatic' ),
            'section'     => 'newsmatic_header_random_news_section',
            'icons' => [ "fas fa-ban", "fas fa-bolt", "fas fa-newspaper", "far fa-newspaper", "fas fa-rss", "fas fa-calendar-week", "far fa-calendar", "far fa-calendar-alt", "fas fa-calendar-alt" ]
        ]));

        $wp_customize->add_setting( 'header_random_news_filter', [
            'default' => ND\newsmatic_get_customizer_default( 'header_random_news_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'header_random_news_filter', [
            'label'	      => esc_html__( 'Type of posts to dislay', 'newsmatic' ),
            'section'     => 'newsmatic_header_random_news_section',
            'choices' => newsmatic_get_random_news_filter_choices_array()
        ]));

        $wp_customize->add_setting( 'header_random_news_label_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'header_random_news_label_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'header_random_news_label_color', [
            'label'	      => esc_html__( 'Label Color', 'newsmatic' ),
            'section'     => 'newsmatic_header_random_news_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_random_news_section_settings' );
endif;

if( ! function_exists( 'newsmatic_secondary_menu_section_settings' ) ) :
    /**
     * MARK: Seconadry Menu Section
     */
    function newsmatic_secondary_menu_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_secondary_menu_section', [
            'title' => esc_html__( 'Secondary Menu', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'newsmatic_secondary_menu_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'newsmatic_secondary_menu_section_tab', [
            'section'     => 'newsmatic_secondary_menu_section',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'secondary_menu_hover_effect', [
            'default' => ND\newsmatic_get_customizer_default( 'secondary_menu_hover_effect' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'secondary_menu_hover_effect', [
            'label'	      => esc_html__( 'Hover Effect', 'newsmatic' ),
            'section'     => 'newsmatic_secondary_menu_section',
            'choices' => [
                [
                    'value' => 'none',
                    'label' => esc_html__('None', 'newsmatic' )
                ],
                [
                    'value' => 'one',
                    'label' => esc_html__('One', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'top_header_menu_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'top_header_menu_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'top_header_menu_color', [
            'label'	      => esc_html__( 'Color', 'newsmatic' ),
            'section'     => 'newsmatic_secondary_menu_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_secondary_menu_section_settings' );
endif;

if( ! function_exists( 'newsmatic_ticker_news_section_settings' ) ) :
    /**
     * MARK: Ticker News Section
     */
    function newsmatic_ticker_news_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_ticker_news_section', [
            'title' => esc_html__( 'Ticker News', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'top_header_ticker_news_post_filter', [
            'default' => ND\newsmatic_get_customizer_default( 'top_header_ticker_news_post_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'top_header_ticker_news_post_filter', [
            'section'     => 'newsmatic_ticker_news_section',
            'choices' => [
                [
                    'value' => 'category',
                    'label' => esc_html__('By category', 'newsmatic' )
                ],
                [
                    'value' => 'title',
                    'label' => esc_html__('By title', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'top_header_ticker_news_categories', [
            'default' => ND\newsmatic_get_customizer_default( 'top_header_ticker_news_categories' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Categories_Multiselect_Control( $wp_customize, 'top_header_ticker_news_categories', [
            'label'     => esc_html__( 'Posts Categories', 'newsmatic' ),
            'section'   => 'newsmatic_ticker_news_section',
            'choices'   => newsmatic_get_multicheckbox_categories_simple_array(),
            'active_callback'   =>  function( $control ){
                return ( $control->manager->get_setting( 'top_header_ticker_news_post_filter' )->value() === 'category' );
            }
        ]));

        $wp_customize->add_setting( 'top_header_ticker_news_posts', [
            'default' => ND\newsmatic_get_customizer_default( 'top_header_ticker_news_posts' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Posts_Multiselect_Control( $wp_customize, 'top_header_ticker_news_posts', [
            'label'     => esc_html__( 'Posts', 'newsmatic' ),
            'section'   => 'newsmatic_ticker_news_section',
            'choices'   => newsmatic_get_multicheckbox_posts_simple_array(),
            'active_callback'   =>  function( $control ){
                return ( $control->manager->get_setting( 'top_header_ticker_news_post_filter' )->value() === 'title' );
            }
        ]));

        $wp_customize->add_setting( 'top_header_ticker_news_date_filter', [
            'default' => ND\newsmatic_get_customizer_default( 'top_header_ticker_news_date_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'top_header_ticker_news_date_filter', [
            'section'     => 'newsmatic_ticker_news_section',
            'choices' => newsmatic_get_date_filter_choices_array()
        ]));
    }
    add_action( 'customize_register', 'newsmatic_ticker_news_section_settings' );
endif;

if( !function_exists( 'newsmatic_customizer_site_identity_panel' ) ) :
    /**
     * Register site identity settings
     * 
     * MARK: Site Identity
     */
    function newsmatic_customizer_site_identity_panel( $wp_customize ) {
        $wp_customize->get_section( 'title_tagline' )->title = esc_html__( 'Site Identity', 'newsmatic' ); // modify site logo label
        $wp_customize->get_section( 'title_tagline' )->title = esc_html__( 'Site Identity', 'newsmatic' );
        $wp_customize->get_control( 'custom_logo' )->priority = 10;
        $wp_customize->get_control( 'site_icon' )->priority = 20;
        $wp_customize->get_control( 'header_textcolor' )->section = 'title_tagline';
        $wp_customize->get_control( 'header_textcolor' )->priority = 20;
        $wp_customize->get_control( 'header_textcolor' )->label = esc_html__( 'Site Title Color', 'newsmatic' );
        $wp_customize->get_control( 'blogname' )->section = 'title_tagline';
        $wp_customize->get_control( 'blogname' )->priority = 30;
        $wp_customize->get_control( 'blogdescription' )->section = 'title_tagline';
        $wp_customize->get_control( 'blogdescription' )->priority = 30;
        $wp_customize->get_control( 'display_header_text' )->section = 'title_tagline';
        $wp_customize->get_control( 'display_header_text' )->label = esc_html__( 'Display site title', 'newsmatic' );
        $wp_customize->get_control( 'display_header_text' )->priority = 40;
        $wp_customize->get_control( 'header_textcolor' )->section = 'title_tagline';
        $wp_customize->get_control( 'header_textcolor' )->priority = 60;
        $wp_customize->get_control( 'header_textcolor' )->label = esc_html__( 'Site Title Color', 'newsmatic' );

        // site title section tab
        $wp_customize->add_setting( 'site_title_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'site_title_section_tab', [
            'section'     => 'title_tagline',
            'priority'  => 1,
            'choices'  => [
                [
                    'name'  => 'general',
                    'title'  => esc_html__( 'General', 'newsmatic' )
                ],
                [
                    'name'  => 'design',
                    'title'  => esc_html__( 'Design', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'logo_and_site_icon_section_heading_toggle', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Heading_Toggle_Control( $wp_customize, 'logo_and_site_icon_section_heading_toggle', [
            'label' =>  esc_html__( 'Logo & Site Icon', 'newsmatic' ),
            'section'   =>  'title_tagline',
            'priority'  =>  5
        ]));

        $wp_customize->add_setting( 'logo_and_site_icon_section_heading_toggle', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Heading_Toggle_Control( $wp_customize, 'logo_and_site_icon_section_heading_toggle', [
            'label' =>  esc_html__( 'Logo & Site Icon', 'newsmatic' ),
            'section'   =>  'title_tagline',
            'priority'  =>  5
        ]));

        $wp_customize->add_setting( 'title_and_tagline_section_heading_toggle', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Heading_Toggle_Control( $wp_customize, 'title_and_tagline_section_heading_toggle', [
            'label' =>  esc_html__( 'Site Title & Tagline', 'newsmatic' ),
            'section'   =>  'title_tagline',
            'priority'  =>  20
        ]));
        
        // site logo width
        $wp_customize->add_setting( 'newsmatic_site_logo_width', [
            'default'   => ND\newsmatic_get_customizer_default( 'newsmatic_site_logo_width' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'newsmatic_site_logo_width', [
            'label'	      => esc_html__( 'Logo Width (px)', 'newsmatic' ),
            'section'     => 'title_tagline',
            'unit'        => 'px',
            'input_attrs' => [
                'max'         => 400,
                'min'         => 1,
                'step'        => 1,
                'reset' => true
            ]
        ]));

        // blog description option
        $wp_customize->add_setting( 'blogdescription_option', [
            'default'        => true,
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( 'blogdescription_option', [
            'label'    => esc_html__( 'Display site description', 'newsmatic' ),
            'section'  => 'title_tagline',
            'type'     => 'checkbox',
            'priority' => 50
        ]);

        // header text hover color
        $wp_customize->add_setting( 'site_title_hover_textcolor', [
            'default' => ND\newsmatic_get_customizer_default( 'site_title_hover_textcolor' ),
            'sanitize_callback' => 'sanitize_hex_color',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Default_Color_Control( $wp_customize, 'site_title_hover_textcolor', [
            'label'      => esc_html__( 'Site Title Hover Color', 'newsmatic' ),
            'section'    => 'title_tagline',
            'settings'   => 'site_title_hover_textcolor',
            'priority'    => 70,
            'tab'   => 'design'
        ]));

        // site description color
        $wp_customize->add_setting( 'site_description_color', [
            'default' => ND\newsmatic_get_customizer_default( 'site_description_color' ),
            'sanitize_callback' => 'sanitize_hex_color',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Default_Color_Control( $wp_customize, 'site_description_color', [
            'label'      => esc_html__( 'Site Description Color', 'newsmatic' ),
            'section'    => 'title_tagline',
            'settings'   => 'site_description_color',
            'priority'    => 70,
            'tab'   => 'design'
        ]));

        // site title typo
        $wp_customize->add_setting( 'site_title_typo', [
            'default'   => ND\newsmatic_get_customizer_default( 'site_title_typo' ),
            'sanitize_callback' => 'newsmatic_sanitize_typo_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Typography_Control( $wp_customize, 'site_title_typo', [
            'label'	      => esc_html__( 'Site Title Typography', 'newsmatic' ),
            'section'     => 'title_tagline',
            'settings'    => 'site_title_typo',
            'tab'   => 'design',
            'fields'    => [ 'font_family', 'font_weight', 'font_size', 'line_height', 'letter_spacing', 'text_transform', 'text_decoration' ]
        ]));

        // site tagline typo
        $wp_customize->add_setting( 'site_tagline_typo', [
            'default'   => ND\newsmatic_get_customizer_default( 'site_tagline_typo' ),
            'sanitize_callback' => 'newsmatic_sanitize_typo_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Typography_Control( $wp_customize, 'site_tagline_typo', [
            'label'	      => esc_html__( 'Site Tagline Typography', 'newsmatic' ),
            'section'     => 'title_tagline',
            'settings'    => 'site_tagline_typo',
            'tab'   => 'design',
            'fields'    => [ 'font_family', 'font_weight', 'font_size', 'line_height', 'letter_spacing', 'text_transform', 'text_decoration' ]
        ]));

        // site title & tagline pre sale
        $wp_customize->add_setting( 'site_title_and_tagline_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'site_title_and_tagline_section_pre_sales', array(
                'label' =>  esc_html__( 'Need More Site Title Options ?', 'newsmatic' ),
                'section'   =>  'title_tagline',
                'features'  =>  [
                    esc_html__( 'More than 1500+ google fonts', 'newsmatic' )
                ],
                'tab'   =>  'design',
                'priority'    => 100,
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_site_identity_panel', 10 );
endif;