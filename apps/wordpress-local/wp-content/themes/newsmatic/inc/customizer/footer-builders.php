<?php
/**
 * Footer Builder Customizer Options
 * 
 * @since 1.4.0
 * @package Newsmatic Pro
 */
use Newsmatic\CustomizerDefault as ND;

if( ! function_exists( 'newsmatic_footer_builders_customizer_options' ) ) :
    /**
     * MARK: Footer Builders
     */
    function newsmatic_footer_builders_customizer_options( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_footer_builder_section', [
            'title' => esc_html__( 'Footer Builder', 'newsmatic' ),
            'active_callback'   =>  function(){ return false; }
        ]);

        $wp_customize->add_setting( 'footer_builder', [
            'sanitize_callback' => 'newsmatic_sanitize_builder_control',
            'default'   => ND\newsmatic_get_customizer_default( 'footer_builder' )
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Control( $wp_customize, 'footer_builder', [
            'section'   =>    'newsmatic_footer_builder_section',
            'builder_settings_section'	=>	'newsmatic_footer_builder_section_settings',
            'placement'	=>	'footer',
            'widgets'	=>	[
                'logo'	=>	[
                    'label' 	=>	esc_html__( 'Logo', 'newsmatic' ),
                    'icon' 	=>	'admin-site',
                    'section'	=>	'newsmatic_footer_logo'
                ],
                'social-icons'	=>	[
                    'label' 	=>	esc_html__( 'Social Icons', 'newsmatic' ),
                    'icon' 	=>	'networking',
                    'section'	=>	'newsmatic_footer_social_icons_section'
                ],
                'copyright'	=>	[
                    'label' 	=>	esc_html__( 'Copyright', 'newsmatic' ),
                    'icon' 	=>	'privacy',
                    'section'	=>	'newsmatic_footer_copyright'
                ],
                'menu'	=>	[
                    'label' 	=>	esc_html__( 'Footer Menu', 'newsmatic' ),
                    'icon' 	=>	'menu',
                    'section'	=>	'newsmatic_footer_menu_options_section'
                ],
                'sidebar-one'	=>	[
                    'label' 	=>	esc_html__( 'Sidebar 1', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-footer-sidebar--column-1'
                ],
                'sidebar-two'	=>	[
                    'label' 	=>	esc_html__( 'Sidebar 2', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-footer-sidebar--column-2'
                ],
                'sidebar-three'	=>	[
                    'label' 	=>	esc_html__( 'Sidebar 3', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-footer-sidebar--column-3'
                ],
                'sidebar-four'	=>	[
                    'label' 	=>	esc_html__( 'Sidebar 4', 'newsmatic' ),
                    'icon' 	=>	'columns',
                    'section'	=>	'sidebar-widgets-footer-sidebar--column-4'
                ],
                'scroll-to-top'	=>	[
                    'label' 	=>	esc_html__( 'Scroll to Top', 'newsmatic' ),
                    'icon' 	=>	'arrow-up-alt2',
                    'section'	=>	'newsmatic_stt_options_section'
                ],
            ]
        ]));
    }
    add_action( 'customize_register', 'newsmatic_footer_builders_customizer_options' );
endif;

if( ! function_exists( 'newsmatic_footer_builder_settings' )  ) :
    /**
     * MARK: Footer Builder Settings
     */
    function newsmatic_footer_builder_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_footer_builder_section_settings', [
            'title' =>  esc_html__( 'Footer Builder', 'newsmatic' ),
            'priority'  =>  74
        ]);

        $wp_customize->add_setting( 'footer_builder_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_builder_section_tab', [
            'section'   =>  'newsmatic_footer_builder_section_settings',
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

        $wp_customize->add_setting( 'footer_section_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_section_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_select_control',
            'transport' =>   'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'footer_section_width', [
            'label' =>  esc_html__( 'Section Width', 'newsmatic' ),
            'section'   =>  'newsmatic_footer_builder_section_settings',
            'choices'   =>  [
                'boxed-width'   =>  [
                    'label' =>  esc_html__( 'Boxed', 'newsmatic' ),
                    'url'   =>  '%s/assets/images/customizer/boxed-width.png'
                ],
                'full-width'   => [
                    'label' =>  esc_html__( 'Full Width', 'newsmatic' ),
                    'url'   =>  '%s/assets/images/customizer/full-width.png'
                ]
            ]
        ]));

        $wp_customize->add_setting( 'footer_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'footer_color' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'footer_color', [
            'label'     => esc_html__( 'Sidebars Text Color', 'newsmatic' ),
            'section'   => 'newsmatic_footer_builder_section_settings',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_footer_builder_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_builder_first_row_settings' ) ) :
    /**
     * MARK: Footer Builder First Row
     */
    function newsmatic_footer_builder_first_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'footer_first_row', [
            'title' => esc_html__( 'Footer First Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'footer_first_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_first_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'footer_first_row',
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

        $wp_customize->add_setting( 'footer_first_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'footer_first_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => NEWSMATIC_PREFIX . 'footer_first_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  4,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'footer_first_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'footer_first_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_first_row',
            'choices'   =>  newsmatic_get_footer_builder_layouts(),
            'row'   =>  1,
            'builder'   =>  'footer'
        ]));

        $wp_customize->add_setting( 'footer_first_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'footer_first_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_first_row',
            'placement'	=>	'footer',
            'builder'	=>	'footer_builder',
            'row'	=>	1
        ]));

        $wp_customize->add_setting( 'footer_first_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'footer_first_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_first_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'footer_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'footer_background_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_image_group_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Image_Group_Control( $wp_customize, 'footer_background_color_group', [
            'label'	      => esc_html__( 'Background Setting', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_first_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'footer_top_border', [
            'default' => ND\newsmatic_get_customizer_default( 'footer_top_border' ),
            'sanitize_callback' => 'newsmatic_sanitize_array',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'footer_top_border', [
            'label'       => esc_html__( 'Border Top', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_first_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'footer_first_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'footer_first_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'footer_first_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_first_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'footer_first_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_first_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_first_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_first_row',
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
        
        $wp_customize->add_setting( 'footer_first_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_first_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_first_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_first_row',
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
        
        $wp_customize->add_setting( 'footer_first_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_first_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_first_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_first_row',
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
        
        $wp_customize->add_setting( 'footer_first_row_column_four', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_first_row_column_four' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_first_row_column_four', [
            'label' =>  esc_html__( 'Column 4 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_first_row_column' )->value(), [ 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_first_row',
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
    add_action( 'customize_register', 'newsmatic_footer_builder_first_row_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_builder_second_row_settings' ) ) :
    /**
     * MARK: Footer Builder Second Row
     */
    function newsmatic_footer_builder_second_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'footer_second_row', [
            'title' =>  esc_html__( 'Footer Second Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'footer_second_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_second_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'footer_second_row',
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

        $wp_customize->add_setting( 'footer_second_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'footer_second_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => NEWSMATIC_PREFIX . 'footer_second_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  4,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'footer_second_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'footer_second_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_second_row',
            'choices'   =>  newsmatic_get_footer_builder_layouts(),
            'row'   =>  2,
            'builder'   =>  'footer'
        ]));

        $wp_customize->add_setting( 'footer_second_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'footer_second_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_second_row',
            'placement'	=>	'footer',
            'builder'	=>	'footer_builder',
            'row'	=>	2
        ]));

        $wp_customize->add_setting( 'footer_second_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'footer_second_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_second_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'bottom_footer_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'bottom_footer_background_color_group' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Control( $wp_customize, 'bottom_footer_background_color_group', [
            'label'	      => esc_html__( 'Background', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_second_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'footer_second_row_border', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_border' ),
            'sanitize_callback' =>  'newsmatic_sanitize_array',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'footer_second_row_border', [
            'label' =>  esc_html__( 'Border Top', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'footer_second_row',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'footer_second_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'footer_second_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'footer_second_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_second_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'footer_second_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_second_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_second_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_second_row',
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
        
        $wp_customize->add_setting( 'footer_second_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_second_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_second_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_second_row',
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
        
        $wp_customize->add_setting( 'footer_second_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_second_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_second_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_second_row',
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
        
        $wp_customize->add_setting( 'footer_second_row_column_four', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_second_row_column_four' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_second_row_column_four', [
            'label' =>  esc_html__( 'Column 4 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_second_row_column' )->value(), [ 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_second_row',
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
    add_action( 'customize_register', 'newsmatic_footer_builder_second_row_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_builder_third_row_settings' ) ) :
    /**
     * MARK: Footer Builder Third Row
     */
    function newsmatic_footer_builder_third_row_settings( $wp_customize ) {
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'footer_third_row', [
            'title' =>  esc_html__( 'Footer Third Row', 'newsmatic' ),
            'priority'  =>  70
        ]);

        $wp_customize->add_setting( 'footer_third_row_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_third_row_section_tab', [
            'section'   =>  NEWSMATIC_PREFIX .'footer_third_row',
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

        $wp_customize->add_setting( 'footer_third_row_column', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column' ),
            'sanitize_callback' =>  'newsmatic_sanitize_number_range',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Number_Range_Control( $wp_customize, 'footer_third_row_column', [
            'label' => esc_html__( 'Column Count', 'newsmatic' ),
            'section' => NEWSMATIC_PREFIX . 'footer_third_row',
            'input_attrs'    =>  [
                'min'   =>  1,
                'max'   =>  4,
                'step'  =>  1,
                'reset' =>  true
            ]
        ]));

        $wp_customize->add_setting( 'footer_third_row_column_layout', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column_layout' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_image'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Image( $wp_customize, 'footer_third_row_column_layout', [
            'label' =>  esc_html__( 'Column Layout', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_third_row',
            'choices'   =>  newsmatic_get_footer_builder_layouts(),
            'row'   =>  3,
            'builder'   =>  'footer'
        ]));

        $wp_customize->add_setting( 'footer_third_row_reflector', [
            'sanitize_callback' =>  'sanitize_text_field'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Builder_Reflector_Control( $wp_customize, 'footer_third_row_reflector', [
            'label' =>  esc_html__( 'Row Widgets', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_third_row',
            'placement'	=>	'footer',
            'builder'	=>	'footer_builder',
            'row'	=>	3
        ]));

        $wp_customize->add_setting( 'footer_third_row_full_width', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_full_width' ),
            'sanitize_callback' =>  'newsmatic_sanitize_toggle_control',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'footer_third_row_full_width', [
            'label' =>  esc_html__( 'Row Full Width', 'newsmatic' ),
            'description'   =>  esc_html__( 'This only applies to the controls below.', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX .'footer_third_row',
            'tab'    =>  'design'
        ]));

        $wp_customize->add_setting( 'footer_third_row_background', [
            'default'   => ND\newsmatic_get_customizer_default( 'footer_third_row_background' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_image_group_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Image_Group_Control( $wp_customize, 'footer_third_row_background', [
            'label'	      => esc_html__( 'Background', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_third_row',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'footer_third_row_border', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_border' ),
            'sanitize_callback' =>  'newsmatic_sanitize_array',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Border_Control( $wp_customize, 'footer_third_row_border', [
            'label' =>  esc_html__( 'Border', 'newsmatic' ),
            'section'   =>  NEWSMATIC_PREFIX . 'footer_third_row',
            'tab'   =>  'design'
        ]));

        $wp_customize->add_setting( 'footer_third_row_padding', [
            'default' => ND\newsmatic_get_customizer_default( 'footer_third_row_padding' ),
            'sanitize_callback' => 'newsmatic_sanitize_box_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Box_Control( $wp_customize, 'footer_third_row_padding', [
            'label'       => esc_html__( 'Padding', 'newsmatic' ),
            'section'     => NEWSMATIC_PREFIX . 'footer_third_row',
            'tab'   => 'design'
        ]));
        
        $wp_customize->add_setting( 'footer_third_row_column_one', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column_one' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_third_row_column_one', [
            'label' =>  esc_html__( 'Column 1 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_third_row_column' )->value(), [ 1, 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_third_row',
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
        
        $wp_customize->add_setting( 'footer_third_row_column_two', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column_two' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_third_row_column_two', [
            'label' =>  esc_html__( 'Column 2 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_third_row_column' )->value(), [ 2, 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_third_row',
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
        
        $wp_customize->add_setting( 'footer_third_row_column_three', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column_three' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_third_row_column_three', [
            'label' =>  esc_html__( 'Column 3 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_third_row_column' )->value(), [ 3, 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_third_row',
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
        
        $wp_customize->add_setting( 'footer_third_row_column_four', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'footer_third_row_column_four' ),
            'sanitize_callback' =>  'newsmatic_sanitize_responsive_radio_tab',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Radio_Tab_Control( $wp_customize, 'footer_third_row_column_four', [
            'label' =>  esc_html__( 'Column 4 Alignment', 'newsmatic' ),
            'active_callback'   =>  function( $control ) {
                return ( in_array( $control->manager->get_setting( 'footer_third_row_column' )->value(), [ 4 ] ) );
            },
            'section' => NEWSMATIC_PREFIX . 'footer_third_row',
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
    add_action( 'customize_register', 'newsmatic_footer_builder_third_row_settings' );
endif;

if( ! function_exists( 'newsmatic_scroll_to_top_settings' ) ) :
    /**
     * MARK: Scroll to top
     */
    function newsmatic_scroll_to_top_settings( $wp_customize ){
        $wp_customize->add_section( 'newsmatic_stt_options_section', [
            'title' => esc_html__( 'Scroll To Top', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'stt_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'stt_section_tab', [
            'section'     => 'newsmatic_stt_options_section',
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

        $wp_customize->add_setting( 'stt_responsive_option', [
            'default' => ND\newsmatic_get_customizer_default( 'stt_responsive_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_multiselect_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Multiselect_Tab_Control( $wp_customize, 'stt_responsive_option', [
            'label'	      => esc_html__( 'Scroll To Top Visibility', 'newsmatic' ),
            'section'     => 'newsmatic_stt_options_section'
        ]));

        $wp_customize->add_setting( 'stt_text', [
            'default' => ND\newsmatic_get_customizer_default('stt_text'),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'stt_text', [
            'label'     => esc_html__( 'Button label', 'newsmatic' ),
            'section'     => 'newsmatic_stt_options_section',
            'icons' => [ "fas fa-ban", "fas fa-angle-up", "fas fa-arrow-alt-circle-up", "far fa-arrow-alt-circle-up", "fas fa-angle-double-up", "fas fa-long-arrow-alt-up", "fas fa-arrow-up", "fas fa-arrow-circle-up", "fas fa-chevron-circle-up", "fas fa-caret-up", "fas fa-hand-point-up", "fas fa-caret-square-up", "far fa-caret-square-up" ]
        ]));

        $wp_customize->add_setting( 'stt_alignment', [
            'default' => ND\newsmatic_get_customizer_default( 'stt_alignment' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'stt_alignment', [
            'label'	      => esc_html__( 'Button Align', 'newsmatic' ),
            'section'     => 'newsmatic_stt_options_section',
            'choices' => [
                [
                    'value' => 'left',
                    'label' => esc_html__('Left', 'newsmatic' )
                ],
                [
                    'value' => 'center',
                    'label' => esc_html__('Center', 'newsmatic' )
                ],
                [
                    'value' => 'right',
                    'label' => esc_html__('Right', 'newsmatic' )
                ]
            ]
        ]));

        $wp_customize->add_setting( 'stt_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'stt_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'stt_color_group', [
            'label'     => esc_html__( 'Icon Text', 'newsmatic' ),
            'section'   => 'newsmatic_stt_options_section',
            'tab'   => 'design'
        ]));

        $wp_customize->add_setting( 'stt_background_color_group', [
            'default'   => ND\newsmatic_get_customizer_default( 'stt_background_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'stt_background_color_group', [
            'label'     => esc_html__( 'Background', 'newsmatic' ),
            'section'   => 'newsmatic_stt_options_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_scroll_to_top_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_menu_settings' ) ) :
    /**
     * MARK: Footer Menu
     */
    function newsmatic_footer_menu_settings( $wp_customize ){
        $wp_customize->add_section( 'newsmatic_footer_menu_options_section', [
            'title' => esc_html__( 'Footer Menu', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'footer_menu_hover_effect', [
            'default' => ND\newsmatic_get_customizer_default( 'footer_menu_hover_effect' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'footer_menu_hover_effect', [
            'label'	      => esc_html__( 'Hover Effect', 'newsmatic' ),
            'section'     => 'newsmatic_footer_menu_options_section',
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
    }
    add_action( 'customize_register', 'newsmatic_footer_menu_settings' );
endif;

if( ! function_exists( 'newsmatic_copyright_settings' ) ) :
    /**
     * MARK: Copyright
     */
    function newsmatic_copyright_settings( $wp_customize ){
        $wp_customize->add_section( 'newsmatic_footer_copyright', [
            'title' => esc_html__( 'Copyright', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'copyright_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'copyright_section_tab', [
            'section'     => 'newsmatic_footer_copyright',
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

        $wp_customize->add_setting( 'bottom_footer_site_info', [
            'default'    => ND\newsmatic_get_customizer_default( 'bottom_footer_site_info' ),
            'sanitize_callback' => 'wp_kses_post',
            'transport' =>  'postMessage'
        ]);
        $wp_customize->add_control( 'bottom_footer_site_info', [
            'label'	      => esc_html__( 'Copyright Text', 'newsmatic' ),
            'type'  =>  'textarea',
            'description' => esc_html__( 'Add %year% to retrieve current year.', 'newsmatic' ),
            'section'     => 'newsmatic_footer_copyright'
        ]);

        $wp_customize->add_setting( 'bottom_footer_text_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'bottom_footer_text_color' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Picker_Control( $wp_customize, 'bottom_footer_text_color', [
            'label'     => esc_html__( 'Text Color', 'newsmatic' ),
            'section'   => 'newsmatic_footer_copyright',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_copyright_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_social_icons_settings' ) ) :
    /**
     * MARK: Social Icons
     */
    function newsmatic_footer_social_icons_settings( $wp_customize ){
        $wp_customize->add_section( 'newsmatic_footer_social_icons_section', [
            'title' => esc_html__( 'Social Icons', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'footer_social_icons_section_tab', [
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_social_icons_section_tab', [
            'section'     => 'newsmatic_footer_social_icons_section',
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
    }
    add_action( 'customize_register', 'newsmatic_footer_social_icons_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_logo_settings' ) ) :
    /**
     * MARK: Social Icons
     */
    function newsmatic_footer_logo_settings( $wp_customize ){
        $wp_customize->add_section( 'newsmatic_footer_logo', [
            'title' => esc_html__( 'Footer Logo', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'bottom_footer_header_or_custom', [
            'default'   =>  ND\newsmatic_get_customizer_default( 'bottom_footer_header_or_custom' ),
            'sanitize_callback' =>  'newsmatic_sanitize_select_control'
        ]);
        $wp_customize->add_control( 'bottom_footer_header_or_custom', [
            'label' =>  esc_html__( 'Logo From', 'newsmatic' ),
            'section'   =>  'newsmatic_footer_logo',
            'type'  =>  'select',
            'choices'   =>  [
                'header'  =>  esc_html__( 'Default Site Logo', 'newsmatic' ),
                'custom'  =>  esc_html__( 'Custom', 'newsmatic' )
            ],
        ]);

        // Footer logo
        $wp_customize->add_setting( 'bottom_footer_logo_option', [
            'default' => ND\newsmatic_get_customizer_default( 'bottom_footer_logo_option' ),
            'sanitize_callback' => 'absint'
        ]);
        $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'bottom_footer_logo_option', [
            'label' => esc_html__( 'Footer Logo', 'newsmatic' ),
            'description' => esc_html__( 'Upload image for bottom footer', 'newsmatic' ),
            'section'   =>  'newsmatic_footer_logo',
            'active_callback'   =>  function( $control ) {
                return ( $control->manager->get_setting( 'bottom_footer_header_or_custom' )->value() == 'custom' );
            }
        ]));

        $wp_customize->add_setting( 'bottom_footer_logo_width', [
            'default'   => ND\newsmatic_get_customizer_default( 'bottom_footer_logo_width' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'bottom_footer_logo_width', [
            'label' =>  esc_html__( 'Logo Width (px)', 'newsmatic' ),
            'section'   =>  'newsmatic_footer_logo',
            'unit'  =>  'px',
            'input_attrs'   =>  [
                'max'   =>  200,
                'min'   =>  1,
                'step'  =>  1,
                'reset' =>  true
            ],
            'active_callback'   =>  function( $control ) {
                return ( $control->manager->get_setting( 'bottom_footer_header_or_custom' )->value() == 'custom' );
            }
        ]));
    }
    add_action( 'customize_register', 'newsmatic_footer_logo_settings' );
endif;

if( ! function_exists( 'newsmatic_footer_social_icons_section_settings' ) ) :
    /**
     * MARK: Social Icons
     */
    function newsmatic_footer_social_icons_section_settings( $wp_customize ) {
        $wp_customize->add_section( 'newsmatic_footer_social_icons_section', [
            'title' => esc_html__( 'Social Icons', 'newsmatic' )
        ]);

        $wp_customize->add_setting( 'footer_social_icons_section_tab', [
            'sanitize_callback' =>  'sanitize_text_field',
            'default'   =>  'general'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'footer_social_icons_section_tab', [
            'section'   =>  'newsmatic_footer_social_icons_section',
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

        $wp_customize->add_setting( 'footer_social_icons_target', [
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'footer_social_icons_target' ),
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( 'footer_social_icons_target', [
            'type'      => 'select',
            'section'   => 'newsmatic_footer_social_icons_section',
            'label'     => esc_html__( 'Social Icon Link Open in', 'newsmatic' ),
            'description' => esc_html__( 'Sets the target attribute according to the value.', 'newsmatic' ),
            'choices'   => [
                '_blank' => esc_html__( 'Open link in new tab', 'newsmatic' ),
                '_self'  => esc_html__( 'Open link in same tab', 'newsmatic' )
            ]
        ]);

        $wp_customize->add_setting( 'footer_social_icons', [
            'default'   => ND\newsmatic_get_customizer_default( 'footer_social_icons' ),
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'transport' => 'postMessage'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Custom_Repeater( $wp_customize, 'footer_social_icons', [
            'label'         => esc_html__( 'Social Icons', 'newsmatic' ),
            'description'   => esc_html__( 'Hold bar icon and drag vertically to re-order the icons', 'newsmatic' ),
            'section'       => 'newsmatic_footer_social_icons_section',
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

        $wp_customize->add_setting( 'footer_social_icons_color', [
            'default'   => ND\newsmatic_get_customizer_default( 'footer_social_icons_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control'
        ]);
        $wp_customize->add_control( new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'footer_social_icons_color', [
            'label'	      => esc_html__( 'Social Icon Color', 'newsmatic' ),
            'section'     => 'newsmatic_footer_social_icons_section',
            'tab'   => 'design'
        ]));
    }
    add_action( 'customize_register', 'newsmatic_footer_social_icons_section_settings' );
endif;