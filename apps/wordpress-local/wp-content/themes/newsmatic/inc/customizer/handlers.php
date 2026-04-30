<?php
use Newsmatic\CustomizerDefault as ND;
/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
add_action( 'customize_preview_init', function() {
    wp_enqueue_script( 
        'newsmatic-customizer-preview',
        get_template_directory_uri() . '/inc/customizer/assets/customizer-preview.min.js',
        ['customize-preview'],
        NEWSMATIC_VERSION,
        true
    );
    // newsmatic scripts
	wp_localize_script( 
        'newsmatic-customizer-preview',
        'newsmaticPreviewObject', array(
            '_wpnonce'	=> wp_create_nonce( 'newsmatic-customizer-nonce' ),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'totalCats' => get_categories() ? get_categories() : []
        )
    );
});

add_action( 'customize_controls_enqueue_scripts', function() {
    $buildControlsDeps = apply_filters(  'newsmatic_customizer_build_controls_dependencies', array(
        'react',
        'wp-blocks',
        'wp-editor',
        'wp-element',
        'wp-i18n',
        'wp-polyfill',
        'jquery',
        'wp-components'
    ));
	wp_enqueue_style( 
        'newsmatic-customizer-control',
        get_template_directory_uri() . '/inc/customizer/assets/customizer-controls.min.css', 
        array('wp-components'),
        NEWSMATIC_VERSION,
        'all'
    );
    wp_enqueue_script( 
        'newsmatic-customizer-control',
        get_template_directory_uri() . '/inc/customizer/assets/customizer-extends.min.js',
        $buildControlsDeps,
        NEWSMATIC_VERSION,
        true
    );
    // newsmatic scripts
    wp_localize_script( 
        'newsmatic-customizer-control', 
        'customizerControlsObject', array(
            'categories'=> newsmatic_get_multicheckbox_categories_simple_array(),
            'posts' => newsmatic_get_multicheckbox_posts_simple_array(),
            'imageSizes'=> newsmatic_get_image_sizes_option_array_for_customizer(),
            '_wpnonce'	=> wp_create_nonce( 'newsmatic-customizer-controls-live-nonce' ),
            'ajaxUrl'   => admin_url('admin-ajax.php')
        )
    );
    wp_enqueue_style( 
        'newsmatic-customizer-builder',
        get_template_directory_uri() . '/inc/customizer/assets/builder.css', 
        array('wp-components'),
        NEWSMATIC_VERSION,
        'all'
    );
    wp_enqueue_script( 
        'newsmatic-customizer-extras',
        get_template_directory_uri() . '/inc/customizer/assets/extras.min.js',
        [],
        NEWSMATIC_VERSION,
        true
    );

    // trendyize scripts
    wp_localize_script( 'newsmatic-customizer-extras', 
        'customizerExtrasObject', [
            '_wpnonce'	=> wp_create_nonce( 'newsmatic-customizer-controls-nonce' ),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'custom_callback'   =>  [
                /* Header Builder custom callbacks */
                'header_first_row_column'   =>  [
                    '1' =>  [ 'header_first_row_column_one' ],
                    '2' =>  [ 'header_first_row_column_one', 'header_first_row_column_two' ],
                    '3' =>  [ 'header_first_row_column_one', 'header_first_row_column_two', 'header_first_row_column_three' ]
                ],
                'header_second_row_column'  =>  [
                    '1' =>  [ 'header_second_row_column_one' ],
                    '2' =>  [ 'header_second_row_column_one', 'header_second_row_column_two' ],
                    '3' =>  [ 'header_second_row_column_one', 'header_second_row_column_two', 'header_second_row_column_three' ]
                ],
                'header_third_row_column'   =>  [
                    '1' =>  [ 'header_third_row_column_one' ],
                    '2' =>  [ 'header_third_row_column_one', 'header_third_row_column_two' ],
                    '3' =>  [ 'header_third_row_column_one', 'header_third_row_column_two', 'header_third_row_column_three' ]
                ],
                /* Footer Builder custom callbacks */
                'footer_first_row_column'   =>  [
                    '1' =>  [ 'footer_first_row_column_one' ],
                    '2' =>  [ 'footer_first_row_column_one', 'footer_first_row_column_two' ],
                    '3' =>  [ 'footer_first_row_column_one', 'footer_first_row_column_two', 'footer_first_row_column_three' ],
                    '4' =>  [ 'footer_first_row_column_one', 'footer_first_row_column_two', 'footer_first_row_column_three', 'footer_first_row_column_four' ],
                ],
                'footer_second_row_column'  =>  [
                    '1' =>  [ 'footer_second_row_column_one' ],
                    '2' =>  [ 'footer_second_row_column_one', 'footer_second_row_column_two' ],
                    '3' =>  [ 'footer_second_row_column_one', 'footer_second_row_column_two', 'footer_second_row_column_three' ],
                    '4' =>  [ 'footer_second_row_column_one', 'footer_second_row_column_two', 'footer_second_row_column_three', 'footer_second_row_column_four' ],
                ],
                'footer_third_row_column'   =>  [
                    '1' =>  [ 'footer_third_row_column_one' ],
                    '2' =>  [ 'footer_third_row_column_one', 'footer_third_row_column_two' ],
                    '3' =>  [ 'footer_third_row_column_one', 'footer_third_row_column_two', 'footer_third_row_column_three' ],
                    '4' =>  [ 'footer_third_row_column_one', 'footer_third_row_column_two', 'footer_third_row_column_three', 'footer_third_row_column_four' ],
                ],
                'header_buiilder_header_sticky' =>  [
                    'true'  =>  [ 'header_first_row_header_sticky', 'header_second_row_header_sticky', 'header_third_row_header_sticky' ]
                ],
            ]
        ]
    );
});

if( !function_exists( 'newsmatic_customizer_about_theme_panel' ) ) :
    /**
     * Register blog archive section settings
     * 
     */
    function newsmatic_customizer_about_theme_panel( $wp_customize ) {
        /**
         * About theme section
         * 
         * @since 1.0.0
         */
        $wp_customize->add_section( NEWSMATIC_PREFIX . 'about_section', array(
            'title' => esc_html__( 'About Theme', 'newsmatic' ),
            'priority'  => 1
        ));

        // upgrade info box
        $wp_customize->add_setting( 'upgrade_info', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Info_Box_Control( $wp_customize, 'upgrade_info', array(
                'label'	      => esc_html__( 'Premium Version', 'newsmatic' ),
                'description' => esc_html__( 'Our premium version of newsmatic includes unlimited news sections with advanced control fields. No limititation on any field and dedicated support.', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'about_section',
                'settings'    => 'upgrade_info',
                'choices' => array(
                    array(
                        'label' => esc_html__( 'View Premium', 'newsmatic' ),
                        'url'   => esc_url( '//blazethemes.com/theme/newsmatic/' )
                    )
                )
            ))
        );

        // theme documentation info box
        $wp_customize->add_setting( 'site_documentation_info', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Info_Box_Control( $wp_customize, 'site_documentation_info', array(
                'label'	      => esc_html__( 'Theme Documentation', 'newsmatic' ),
                'description' => esc_html__( 'We have well prepared documentation which includes overall instructions and recommendations that are required in this theme.', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'about_section',
                'settings'    => 'site_documentation_info',
                'choices' => array(
                    array(
                        'label' => esc_html__( 'View Documentation', 'newsmatic' ),
                        'url'   => esc_url( '//doc.blazethemes.com/newsmatic' )
                    )
                )
            ))
        );

        // theme documentation info box
        $wp_customize->add_setting( 'site_support_info', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Info_Box_Control( $wp_customize, 'site_support_info', array(
                'label'	      => esc_html__( 'Theme Support', 'newsmatic' ),
                'description' => esc_html__( 'We provide 24/7 support regarding any theme issue. Our support team will help you to solve any kind of issue. Feel free to contact us.', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'about_section',
                'settings'    => 'site_support_info',
                'choices' => array(
                    array(
                        'label' => esc_html__( 'Support Form', 'newsmatic' ),
                        'url'   => esc_url( '//blazethemes.com/support' )
                    )
                )
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_about_theme_panel', 10 );
endif;

if( !function_exists( 'newsmatic_customizer_global_panel' ) ) :
    /**
     * Register global options settings
     * 
     */
    function newsmatic_customizer_global_panel( $wp_customize ) {
        /**
         * Global panel
         * 
         * @package Newsmatic
         * @since 1.0.0
         */
        $wp_customize->add_panel( 'newsmatic_global_panel', array(
            'title' => esc_html__( 'Global', 'newsmatic' ),
            'priority'  => 5
        ));

        // section- seo/misc settings section
        $wp_customize->add_section( 'newsmatic_seo_misc_section', array(
            'title' => esc_html__( 'SEO / Misc', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // site schema ready option
        $wp_customize->add_setting( 'site_schema_ready', array(
            'default'   => ND\newsmatic_get_customizer_default( 'site_schema_ready' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport'    => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Toggle_Control( $wp_customize, 'site_schema_ready', array(
                'label'	      => esc_html__( 'Make website schema ready', 'newsmatic' ),
                'section'     => 'newsmatic_seo_misc_section',
                'settings'    => 'site_schema_ready'
            ))
        );

        // site date to show
        $wp_customize->add_setting( 'site_date_to_show', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'site_date_to_show' )
        ));
        $wp_customize->add_control( 'site_date_to_show', array(
            'type'      => 'select',
            'section'   => 'newsmatic_seo_misc_section',
            'label'     => esc_html__( 'Date to display', 'newsmatic' ),
            'description' => esc_html__( 'Whether to show date published or modified date.', 'newsmatic' ),
            'choices'   => array(
                'published'  => __( 'Published date', 'newsmatic' ),
                'modified'   => __( 'Modified date', 'newsmatic' )
            )
        ));

        // site date format
        $wp_customize->add_setting( 'site_date_format', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'site_date_format' )
        ));
        $wp_customize->add_control( 'site_date_format', array(
            'type'      => 'select',
            'section'   => 'newsmatic_seo_misc_section',
            'label'     => esc_html__( 'Date format', 'newsmatic' ),
            'description' => esc_html__( 'Date format applied to single and archive pages.', 'newsmatic' ),
            'choices'   => array(
                'theme_format'  => __( 'Default by theme', 'newsmatic' ),
                'default'   => __( 'Wordpress default date', 'newsmatic' )
            )
        ));

        // notices header
        $wp_customize->add_setting( 'newsmatic_disable_admin_notices_heading', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'newsmatic_disable_admin_notices_heading', array(
                'label'	      => esc_html__( 'Admin Settings', 'newsmatic' ),
                'section'     => 'newsmatic_seo_misc_section',
                'settings'    => 'newsmatic_disable_admin_notices_heading'
            ))
        );

        // site notices option
        $wp_customize->add_setting( 'newsmatic_disable_admin_notices', array(
            'default'   => ND\newsmatic_get_customizer_default( 'newsmatic_disable_admin_notices' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport'    => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Toggle_Control( $wp_customize, 'newsmatic_disable_admin_notices', array(
                'label'	      => esc_html__( 'Disabled the theme admin notices', 'newsmatic' ),
                'description'	      => esc_html__( 'This will hide all the notices or any message shown by the theme like review notices, upgrade log, change log notices', 'newsmatic' ),
                'section'     => 'newsmatic_seo_misc_section',
                'settings'    => 'newsmatic_disable_admin_notices'
            ))
        );

        // preset colors header
        $wp_customize->add_setting( 'preset_colors_heading', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'preset_colors_heading', array(
                'label'	      => esc_html__( 'Theme Presets', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_colors_heading'
            ))
        );

        // primary preset color
        $wp_customize->add_setting( 'preset_color_1', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_1' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_1', array(
                'label'	      => esc_html__( 'Color 1', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_1',
                'variable'   => '--newsmatic-global-preset-color-1'
            ))
        );

        // secondary preset color
        $wp_customize->add_setting( 'preset_color_2', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_2' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_2', array(
                'label'	      => esc_html__( 'Color 2', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_2',
                'variable'   => '--newsmatic-global-preset-color-2'
            ))
        );

        // tertiary preset color
        $wp_customize->add_setting( 'preset_color_3', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_3' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_3', array(
                'label'	      => esc_html__( 'Color 3', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_3',
                'variable'   => '--newsmatic-global-preset-color-3'
            ))
        );

        // primary preset link color
        $wp_customize->add_setting( 'preset_color_4', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_4' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_4', array(
                'label'	      => esc_html__( 'Color 4', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_4',
                'variable'   => '--newsmatic-global-preset-color-4'
            ))
        );

        // secondary preset link color
        $wp_customize->add_setting( 'preset_color_5', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_5' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_5', array(
                'label'	      => esc_html__( 'Color 5', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_5',
                'variable'   => '--newsmatic-global-preset-color-5'
            ))
        );
        
        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_6', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_6' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_6', array(
                'label'	      => esc_html__( 'Color 6', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_6',
                'variable'   => '--newsmatic-global-preset-color-6'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_7', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_7' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_7', array(
                'label'       => esc_html__( 'Color 7', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_7',
                'variable'   => '--newsmatic-global-preset-color-7'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_8', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_8' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_8', array(
                'label'       => esc_html__( 'Color 8', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_8',
                'variable'   => '--newsmatic-global-preset-color-8'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_9', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_9' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_9', array(
                'label'       => esc_html__( 'Color 9', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_9',
                'variable'   => '--newsmatic-global-preset-color-9'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_10', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_10' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_10', array(
                'label'       => esc_html__( 'Color 10', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_10',
                'variable'   => '--newsmatic-global-preset-color-10'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_11', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_11' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_11', array(
                'label'       => esc_html__( 'Color 11', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_11',
                'variable'   => '--newsmatic-global-preset-color-11'
            ))
        );

        // tertiary preset link color
        $wp_customize->add_setting( 'preset_color_12', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_color_12' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'newsmatic_sanitize_color_picker_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Color_Picker_Control( $wp_customize, 'preset_color_12', array(
                'label'       => esc_html__( 'Color 12', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_color_12',
                'variable'   => '--newsmatic-global-preset-color-12'
            ))
        );

        // gradient preset colors header
        $wp_customize->add_setting( 'gradient_preset_colors_heading', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'gradient_preset_colors_heading', array(
                'label'	      => esc_html__( 'Gradient Presets', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'gradient_preset_colors_heading'
            ))
        );

        // gradient color 1
        $wp_customize->add_setting( 'preset_gradient_1', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_1' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_1', array(
                'label'	      => esc_html__( 'Gradient 1', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_1',
                'variable'   => '--newsmatic-global-preset-gradient-color-1'
            ))
        );
        
        // gradient color 2
        $wp_customize->add_setting( 'preset_gradient_2', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_2' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_2', array(
                'label'	      => esc_html__( 'Gradient 2', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_2',
                'variable'   => '--newsmatic-global-preset-gradient-color-2'
            ))
        );

        // gradient color 3
        $wp_customize->add_setting( 'preset_gradient_3', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_3' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_3', array(
                'label'	      => esc_html__( 'Gradient 3', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_3',
                'variable'   => '--newsmatic-global-preset-gradient-color-3'
            ))
        );

        // gradient color 4
        $wp_customize->add_setting( 'preset_gradient_4', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_4' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_4', array(
                'label'	      => esc_html__( 'Gradient 4', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_4',
                'variable'   => '--newsmatic-global-preset-gradient-color-4'
            ))
        );

        // gradient color 5
        $wp_customize->add_setting( 'preset_gradient_5', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_5' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_5', array(
                'label'	      => esc_html__( 'Gradient 5', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_5',
                'variable'   => '--newsmatic-global-preset-gradient-color-5'
            ))
        );

        // gradient color 6
        $wp_customize->add_setting( 'preset_gradient_6', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_6' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_6', array(
                'label'	      => esc_html__( 'Gradient 6', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_6',
                'variable'   => '--newsmatic-global-preset-gradient-color-6'
            ))
        );

        // gradient color 7
        $wp_customize->add_setting( 'preset_gradient_7', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_7' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_7', array(
                'label'       => esc_html__( 'Gradient 7', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_7',
                'variable'   => '--newsmatic-global-preset-gradient-color-7'
            ))
        );

        // gradient color 8
        $wp_customize->add_setting( 'preset_gradient_8', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_8' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_8', array(
                'label'       => esc_html__( 'Gradient 8', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_8',
                'variable'   => '--newsmatic-global-preset-gradient-color-8'
            ))
        );

        // gradient color 9
        $wp_customize->add_setting( 'preset_gradient_9', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_9' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_9', array(
                'label'       => esc_html__( 'Gradient 9', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_9',
                'variable'   => '--newsmatic-global-preset-gradient-color-9'
            ))
        );

        // gradient color 10
        $wp_customize->add_setting( 'preset_gradient_10', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_10' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_10', array(
                'label'       => esc_html__( 'Gradient 10', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_10',
                'variable'   => '--newsmatic-global-preset-gradient-color-10'
            ))
        );

        // gradient color 11
        $wp_customize->add_setting( 'preset_gradient_11', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_11' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_11', array(
                'label'       => esc_html__( 'Gradient 11', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_11',
                'variable'   => '--newsmatic-global-preset-gradient-color-11'
            ))
        );

        // gradient color 12
        $wp_customize->add_setting( 'preset_gradient_12', array(
            'default'   => ND\newsmatic_get_customizer_default( 'preset_gradient_12' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Preset_Gradient_Picker_Control( $wp_customize, 'preset_gradient_12', array(
                'label'       => esc_html__( 'Gradient 12', 'newsmatic' ),
                'section'     => 'colors',
                'settings'    => 'preset_gradient_12',
                'variable'   => '--newsmatic-global-preset-gradient-color-12'
            ))
        );

        // section- category colors section
        $wp_customize->add_section( 'newsmatic_category_colors_section', array(
            'title' => esc_html__( 'Category Colors', 'newsmatic' ),
            'priority'  => 40
        ));

        $totalCats = get_categories();
        if( $totalCats ) :
            foreach( $totalCats as $singleCat ) :
                // category colors control
                $wp_customize->add_setting( 'category_' .absint($singleCat->term_id). '_color', array(
                    'default'   => ND\newsmatic_get_customizer_default('category_' .absint($singleCat->term_id). '_color'),
                    'sanitize_callback' => 'newsmatic_sanitize_color_picker_control',
                    'transport' =>  'postMessage'
                ));
                $wp_customize->add_control(
                    new Newsmatic_WP_Color_Picker_Control( $wp_customize, 'category_' .absint($singleCat->term_id). '_color', array(
                        'label'     => esc_html($singleCat->name),
                        'section'   => 'newsmatic_category_colors_section',
                        'settings'  => 'category_' .absint($singleCat->term_id). '_color'
                    ))
                );
            endforeach;
        endif;

        // section- preloader section
        $wp_customize->add_section( 'newsmatic_preloader_section', array(
            'title' => esc_html__( 'Preloader', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));
        
        // preloader option
        $wp_customize->add_setting( 'preloader_option', array(
            'default'   => ND\newsmatic_get_customizer_default('preloader_option'),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'preloader_option', array(
                'label'	      => esc_html__( 'Enable site preloader', 'newsmatic' ),
                'section'     => 'newsmatic_preloader_section',
                'settings'    => 'preloader_option'
            ))
        );

        // section- website styles section
        $wp_customize->add_section( 'newsmatic_website_styles_section', array(
            'title' => esc_html__( 'Website Styles', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // website block top border style heading
        $wp_customize->add_setting( 'website_block_top_border_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'website_block_top_border_header', array(
                'label'	      => esc_html__( 'Block Top Border Style', 'newsmatic' ),
                'section'     => 'newsmatic_website_styles_section',
                'settings'    => 'website_block_top_border_header'
            ))
        );

        // website block top border
        $wp_customize->add_setting( 'website_block_border_top_option', array(
            'default'   => ND\newsmatic_get_customizer_default('website_block_border_top_option'),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'website_block_border_top_option', array(
                'label'	      => esc_html__( 'Website block top border', 'newsmatic' ),
                'section'     => 'newsmatic_website_styles_section',
                'settings'    => 'website_block_border_top_option'
            ))
        );

        // border color
        $wp_customize->add_setting( 'website_block_border_top_color', array(
            'default'   => ND\newsmatic_get_customizer_default( 'website_block_border_top_color' ),
            'transport' => 'postMessage',
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Color_Group_Control( $wp_customize, 'website_block_border_top_color', array(
                'label'	      => esc_html__( 'Border Color', 'newsmatic' ),
                'section'     => 'newsmatic_website_styles_section',
                'settings'    => 'website_block_border_top_color'
            ))
        );

        // Website style pre sale
        $wp_customize->add_setting( 'website_styles_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'website_styles_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Website Styles Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_website_styles_section',
                'features'  =>  [
                    esc_html__( 'Enable Website Frame', 'newsmatic' ),
                    esc_html__( 'Frame Width & Color', 'newsmatic' ),
                    esc_html__( 'Border Width & Box Shadow', 'newsmatic' ),
                ]
            ))
        );

        // section- website layout section
        $wp_customize->add_section( 'newsmatic_website_layout_section', array(
            'title' => esc_html__( 'Website Layout', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));
        
        // website layout heading
        $wp_customize->add_setting( 'website_layout_header', array(
            'sanitize_callback' => 'sanitize_text_field',
            'transport' =>  'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'website_layout_header', array(
                'label'	      => esc_html__( 'Website Layout', 'newsmatic' ),
                'section'     => 'newsmatic_website_layout_section',
                'settings'    => 'website_layout_header'
            ))
        );

        // website layout
        $wp_customize->add_setting( 'website_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'website_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'transport' =>  'postMessage'
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'website_layout',
            array(
                'section'  => 'newsmatic_website_layout_section',
                'choices'  => array(
                    'boxed--layout' => array(
                        'label' => esc_html__( 'Boxed', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/boxed-width.png'
                    ),
                    'full-width--layout' => array(
                        'label' => esc_html__( 'Full Width', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/full-width.png'
                    )
                )
            )
        ));
        
        // section- animation section
        $wp_customize->add_section( 'newsmatic_animation_section', array(
            'title' => esc_html__( 'Animation / Hover Effects', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));
        
        // post title animation effects 
        $wp_customize->add_setting( 'post_title_hover_effects', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'post_title_hover_effects' ),
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 'post_title_hover_effects', array(
            'type'      => 'select',
            'section'   => 'newsmatic_animation_section',
            'label'     => esc_html__( 'Post title hover effects', 'newsmatic' ),
            'description' => esc_html__( 'Applied to post titles listed in archive pages.', 'newsmatic' ),
            'choices'   => array(
                'none' => __( 'None', 'newsmatic' ),
                'one'  => __( 'Effect one', 'newsmatic' ),
                'two'  => __( 'Effect Two', 'newsmatic' )    
            )
        ));

        // site image animation effects 
        $wp_customize->add_setting( 'site_image_hover_effects', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'site_image_hover_effects' ),
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 'site_image_hover_effects', array(
            'type'      => 'select',
            'section'   => 'newsmatic_animation_section',
            'label'     => esc_html__( 'Image hover effects', 'newsmatic' ),
            'description' => esc_html__( 'Applied to post thumbanails listed in archive pages.', 'newsmatic' ),
            'choices'   => array(
                'none' => __( 'None', 'newsmatic' ),
                'two'  => __( 'Effect One', 'newsmatic' ),
                'four'  => __( 'Effect Two', 'newsmatic' )
            )
        ));

        // Animation section pre sale
        $wp_customize->add_setting( 'animation_hover_effects_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'animation_hover_effects_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More animation Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_animation_section',
                'features'  =>  [
                    esc_html__( 'Enable Site Wow animation', 'newsmatic' ),
                    esc_html__( '5 post title hover effects', 'newsmatic' ),
                    esc_html__( '5 image hover effects', 'newsmatic' ),
                ]
            ))
        );

        // section- social icons section
        $wp_customize->add_section( 'newsmatic_social_icons_section', array(
            'title' => esc_html__( 'Social Icons', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));
        
        // social icons setting heading
        $wp_customize->add_setting( 'social_icons_settings_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'social_icons_settings_header', array(
                'label'	      => esc_html__( 'Social Icons Settings', 'newsmatic' ),
                'section'     => 'newsmatic_social_icons_section',
                'settings'    => 'social_icons_settings_header'
            ))
        );

        // social icons target attribute value
        $wp_customize->add_setting( 'social_icons_target', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'social_icons_target' ),
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 'social_icons_target', array(
            'type'      => 'select',
            'section'   => 'newsmatic_social_icons_section',
            'label'     => esc_html__( 'Social Icon Link Open in', 'newsmatic' ),
            'description' => esc_html__( 'Sets the target attribute according to the value.', 'newsmatic' ),
            'choices'   => array(
                '_blank' => esc_html__( 'Open link in new tab', 'newsmatic' ),
                '_self'  => esc_html__( 'Open link in same tab', 'newsmatic' )
            )
        ));

        // social icons items
        $wp_customize->add_setting( 'social_icons', array(
            'default'   => ND\newsmatic_get_customizer_default( 'social_icons' ),
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Custom_Repeater( $wp_customize, 'social_icons', array(
                'label'         => esc_html__( 'Social Icons', 'newsmatic' ),
                'description'   => esc_html__( 'Hold bar icon and drag vertically to re-order the icons', 'newsmatic' ),
                'section'       => 'newsmatic_social_icons_section',
                'settings'      => 'social_icons',
                'row_label'     => 'inherit-icon_class',
                'add_new_label' => esc_html__( 'Add New Icon', 'newsmatic' ),
                'fields'        => array(
                    'icon_class'   => array(
                        'type'          => 'fontawesome-icon-picker',
                        'label'         => esc_html__( 'Social Icon', 'newsmatic' ),
                        'description'   => esc_html__( 'Select from dropdown.', 'newsmatic' ),
                        'default'       => esc_attr( 'fab fa-instagram' )

                    ),
                    'icon_url'  => array(
                        'type'      => 'url',
                        'label'     => esc_html__( 'URL for icon', 'newsmatic' ),
                        'default'   => ''
                    ),
                    'item_option'             => 'show'
                )
            ))
        );

        // section- buttons section
        $wp_customize->add_section( 'newsmatic_buttons_section', array(
            'title' => esc_html__( 'Buttons', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // read more button label
        $wp_customize->add_setting( 'global_button_text', array(
            'default' => ND\newsmatic_get_customizer_default( 'global_button_text' ),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'global_button_text', array(
                'label'     => esc_html__( 'Button label', 'newsmatic' ),
                'section'     => 'newsmatic_buttons_section',
                'settings'    => 'global_button_text',
                'icons' => array( "fas fa-ban", "fas fa-angle-right", "fas fa-arrow-alt-circle-right", "far fa-arrow-alt-circle-right", "fas fa-angle-double-right", "fas fa-long-arrow-alt-right", "fas fa-arrow-right", "fas fa-arrow-circle-right", "fas fa-chevron-circle-right", "fas fa-caret-right", "fas fa-hand-point-right", "fas fa-caret-square-right", "far fa-caret-square-right" )
            ))
        );

        $wp_customize->add_setting( 'global_button_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'global_button_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Global Button Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_buttons_section',
                'features'  =>  [
                    esc_html__( 'Font Size', 'newsmatic' ),
                    esc_html__( 'Border', 'newsmatic' ),
                    esc_html__( 'Padding', 'newsmatic' )
                ]
            ))
        );
        
        // section- sidebar options section
        $wp_customize->add_section( 'newsmatic_sidebar_options_section', array(
            'title' => esc_html__( 'Sidebar Options', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // frontpage sidebar layout heading
        $wp_customize->add_setting( 'frontpage_sidebar_layout_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'frontpage_sidebar_layout_header', array(
                'label'	      => esc_html__( 'Frontpage Sidebar Layouts', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'frontpage_sidebar_layout_header'
            ))
        );

        // frontpage sidebar layout
        $wp_customize->add_setting( 'frontpage_sidebar_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'frontpage_sidebar_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'frontpage_sidebar_layout',
            array(
                'section'  => 'newsmatic_sidebar_options_section',
                'choices'  => newsmatic_get_customizer_sidebar_array()
            )
        ));

        // frontpage sidebar sticky option
        $wp_customize->add_setting( 'frontpage_sidebar_sticky_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'frontpage_sidebar_sticky_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'frontpage_sidebar_sticky_option', array(
                'label'	      => esc_html__( 'Enable sidebar sticky', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'frontpage_sidebar_sticky_option'
            ))
        );

        // archive sidebar layouts heading
        $wp_customize->add_setting( 'archive_sidebar_layout_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'archive_sidebar_layout_header', array(
                'label'	      => esc_html__( 'Archive Sidebar Layouts', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'archive_sidebar_layout_header'
            ))
        );

        // archive sidebar layout
        $wp_customize->add_setting( 'archive_sidebar_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'archive_sidebar_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'archive_sidebar_layout',
            array(
                'section'  => 'newsmatic_sidebar_options_section',
                'choices'  => newsmatic_get_customizer_sidebar_array()
            )
        ));

        // archive sidebar sticky option
        $wp_customize->add_setting( 'archive_sidebar_sticky_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'archive_sidebar_sticky_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'archive_sidebar_sticky_option', array(
                'label'	      => esc_html__( 'Enable sidebar sticky', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'archive_sidebar_sticky_option'
            ))
        );

        // single sidebar layouts heading
        $wp_customize->add_setting( 'single_sidebar_layout_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'single_sidebar_layout_header', array(
                'label'	      => esc_html__( 'Post Sidebar Layouts', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'single_sidebar_layout_header'
            ))
        );

        // single sidebar layout
        $wp_customize->add_setting( 'single_sidebar_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'single_sidebar_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'single_sidebar_layout',
            array(
                'section'  => 'newsmatic_sidebar_options_section',
                'choices'  => newsmatic_get_customizer_sidebar_array()
            )
        ));

        // single sidebar sticky option
        $wp_customize->add_setting( 'single_sidebar_sticky_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'single_sidebar_sticky_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'single_sidebar_sticky_option', array(
                'label'	      => esc_html__( 'Enable sidebar sticky', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'single_sidebar_sticky_option'
            ))
        );

        // page sidebar layouts heading
        $wp_customize->add_setting( 'page_sidebar_layout_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'page_sidebar_layout_header', array(
                'label'	      => esc_html__( 'Page Sidebar Layouts', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'page_sidebar_layout_header'
            ))
        );

        // page sidebar layout
        $wp_customize->add_setting( 'page_sidebar_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'page_sidebar_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'page_sidebar_layout',
            array(
                'section'  => 'newsmatic_sidebar_options_section',
                'choices'  => newsmatic_get_customizer_sidebar_array()
            )
        ));

        // page sidebar sticky option
        $wp_customize->add_setting( 'page_sidebar_sticky_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'page_sidebar_sticky_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'page_sidebar_sticky_option', array(
                'label'	      => esc_html__( 'Enable sidebar sticky', 'newsmatic' ),
                'section'     => 'newsmatic_sidebar_options_section',
                'settings'    => 'page_sidebar_sticky_option'
            ))
        );

        // section- breadcrumb options section
        $wp_customize->add_section( 'newsmatic_breadcrumb_options_section', array(
            'title' => esc_html__( 'Breadcrumb Options', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // breadcrumb option
        $wp_customize->add_setting( 'site_breadcrumb_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'site_breadcrumb_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'site_breadcrumb_option', array(
                'label'	      => esc_html__( 'Show breadcrumb trails', 'newsmatic' ),
                'section'     => 'newsmatic_breadcrumb_options_section',
                'settings'    => 'site_breadcrumb_option'
            ))
        );

        // breadcrumb type 
        $wp_customize->add_setting( 'site_breadcrumb_type', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'site_breadcrumb_type' )
        ));
        $wp_customize->add_control( 'site_breadcrumb_type', array(
            'type'      => 'select',
            'section'   => 'newsmatic_breadcrumb_options_section',
            'label'     => esc_html__( 'Breadcrumb type', 'newsmatic' ),
            'description' => esc_html__( 'If you use other than "default" one you will need to install and activate respective plugins Breadcrumb NavXT, Yoast SEO and Rank Math SEO', 'newsmatic' ),
            'choices'   => array(
                'default' => __( 'Default', 'newsmatic' ),
                'bcn'  => __( 'NavXT', 'newsmatic' ),
                'yoast'  => __( 'Yoast SEO', 'newsmatic' ),
                'rankmath'  => __( 'Rank Math', 'newsmatic' )
            )
        ));

        // breadcrumb hook on
        $wp_customize->add_setting( 'site_breadcrumb_hook_on', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'site_breadcrumb_hook_on' )
        ));
        $wp_customize->add_control( 'site_breadcrumb_hook_on', array(
            'type'      => 'select',
            'section'   => 'newsmatic_breadcrumb_options_section',
            'label'     => esc_html__( 'Display Breadcrumb On', 'newsmatic' ),
            'choices'   => array(
                'main_container' => __( 'Before Main Container - Full Width', 'newsmatic' ),
                'inner_container'  => __( 'Before Inner Container', 'newsmatic' )
            )
        ));

        // site breadcrumb pre sale
        $wp_customize->add_setting( 'site_breadcrumb_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'site_breadcrumb_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More breadcrumb Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_breadcrumb_options_section',
                'features'  =>  [
                    esc_html__( 'Text Color', 'newsmatic' ),
                    esc_html__( 'Link Color', 'newsmatic' ),
                    esc_html__( 'Background', 'newsmatic' )
                ]
            ))
        );

        // section- scroll to top options
        $wp_customize->add_section( 'newsmatic_stt_options_section', array(
            'title' => esc_html__( 'Scroll To Top', 'newsmatic' ),
            'panel' => 'newsmatic_global_panel'
        ));

        // scroll to top section tab
        $wp_customize->add_setting( 'stt_section_tab', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'stt_section_tab', array(
                'section'     => 'newsmatic_stt_options_section',
                'choices'  => array(
                    array(
                        'name'  => 'general',
                        'title'  => esc_html__( 'General', 'newsmatic' )
                    ),
                    array(
                        'name'  => 'design',
                        'title'  => esc_html__( 'Design', 'newsmatic' )
                    )
                )
            ))
        );

        // Resposive vivibility option
        $wp_customize->add_setting( 'stt_responsive_option', array(
            'default' => ND\newsmatic_get_customizer_default( 'stt_responsive_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_multiselect_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Responsive_Multiselect_Tab_Control( $wp_customize, 'stt_responsive_option', array(
                'label'	      => esc_html__( 'Scroll To Top Visibility', 'newsmatic' ),
                'section'     => 'newsmatic_stt_options_section',
                'settings'    => 'stt_responsive_option'
            ))
        );

        // stt button label
        $wp_customize->add_setting( 'stt_text', array(
            'default' => ND\newsmatic_get_customizer_default('stt_text'),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'stt_text', array(
                'label'     => esc_html__( 'Button label', 'newsmatic' ),
                'section'     => 'newsmatic_stt_options_section',
                'settings'    => 'stt_text',
                'icons' => array( "fas fa-ban", "fas fa-angle-up", "fas fa-arrow-alt-circle-up", "far fa-arrow-alt-circle-up", "fas fa-angle-double-up", "fas fa-long-arrow-alt-up", "fas fa-arrow-up", "fas fa-arrow-circle-up", "fas fa-chevron-circle-up", "fas fa-caret-up", "fas fa-hand-point-up", "fas fa-caret-square-up", "far fa-caret-square-up" )
            ))
        );

        // archive pagination type
        $wp_customize->add_setting( 'stt_alignment', array(
            'default' => ND\newsmatic_get_customizer_default( 'stt_alignment' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Tab_Control( $wp_customize, 'stt_alignment', array(
                'label'	      => esc_html__( 'Button Align', 'newsmatic' ),
                'section'     => 'newsmatic_stt_options_section',
                'settings'    => 'stt_alignment',
                'choices' => array(
                    array(
                        'value' => 'left',
                        'label' => esc_html__('Left', 'newsmatic' )
                    ),
                    array(
                        'value' => 'center',
                        'label' => esc_html__('Center', 'newsmatic' )
                    ),
                    array(
                        'value' => 'right',
                        'label' => esc_html__('Right', 'newsmatic' )
                    )
                )
            ))
        );

        // scroll to top pre sale
        $wp_customize->add_setting( 'stt_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field',
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'stt_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More scroll to top Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_stt_options_section',
                'priority'  =>  20,
                'features'  =>  [
                    esc_html__( 'Font Size', 'newsmatic' ),
                    esc_html__( 'Border Hover', 'newsmatic' ),
                    esc_html__( 'Padding', 'newsmatic' )
                ]
            ))
        );

        // stt label color
        $wp_customize->add_setting( 'stt_color_group', array(
            'default'   => ND\newsmatic_get_customizer_default( 'stt_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'stt_color_group', array(
                'label'     => esc_html__( 'Icon Text', 'newsmatic' ),
                'section'   => 'newsmatic_stt_options_section',
                'settings'  => 'stt_color_group',
                'tab'   => 'design'
            ))
        );

        // breadcrumb link color
        $wp_customize->add_setting( 'stt_background_color_group', array(
            'default'   => ND\newsmatic_get_customizer_default( 'stt_background_color_group' ),
            'sanitize_callback' => 'newsmatic_sanitize_color_group_picker_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Color_Group_Picker_Control( $wp_customize, 'stt_background_color_group', array(
                'label'     => esc_html__( 'Background', 'newsmatic' ),
                'section'   => 'newsmatic_stt_options_section',
                'settings'  => 'stt_background_color_group',
                'tab'   => 'design'
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_global_panel', 10 );
endif;

require get_template_directory() . '/inc/customizer/header-builders.php';

if( !function_exists( 'newsmatic_customizer_ticker_news_panel' ) ) :
    // Register header options settings
    function newsmatic_customizer_ticker_news_panel( $wp_customize ) {
        // Header ads banner section
        $wp_customize->add_section( 'newsmatic_ticker_news_frontpage_section', array(
            'title' => esc_html__( 'Ticker News', 'newsmatic' ),
            'priority'  => 70
        ));

        // Header menu hover effect
        $wp_customize->add_setting( 'ticker_news_visible', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_visible' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control'
        ));
        
        $wp_customize->add_control( 'ticker_news_visible', array(
            'type'      => 'select',
            'section'   => 'newsmatic_ticker_news_frontpage_section',
            'priority'  => 10,
            'label'     => esc_html__( 'Show ticker on', 'newsmatic' ),
            'choices'   => array(
                'all' => esc_html__( 'Show in all', 'newsmatic' ),
                'front-page' => esc_html__( 'Frontpage', 'newsmatic' ),
                'innerpages' => esc_html__( 'Show only in innerpages', 'newsmatic' ),
                'none' => esc_html__( 'Hide in all pages', 'newsmatic' ),
            ),
        ));

        // Ticker News content setting heading
        $wp_customize->add_setting( 'ticker_news_content_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'ticker_news_content_header', array(
                'label'	      => esc_html__( 'Content Setting', 'newsmatic' ),
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'priority'  => 30,
                'settings'    => 'ticker_news_content_header',
                'type'        => 'section-heading',
            ))
        );
        
        // Ticker News title
        $wp_customize->add_setting( 'ticker_news_title', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_title' ),
            'sanitize_callback' => 'newsmatic_sanitize_custom_text_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Icon_Text_Control( $wp_customize, 'ticker_news_title', array(
                'label'     => esc_html__( 'Ticker title', 'newsmatic' ),
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'priority'  => 40,
                'settings'    => 'ticker_news_title',
                'icons' => array( "fas fa-ban", "fas fa-bolt", "fas fa-rss", "fas fa-newspaper", "far fa-newspaper", "fas fa-rss-square", "fas fa-fire", "fas fa-wifi", "fab fa-gripfire", "fab fa-free-code-camp", "fas fa-globe-americas" )
            ))
        );

        // Ticker News posts filter
        $wp_customize->add_setting( 'ticker_news_post_filter', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_post_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'ticker_news_post_filter', array(
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'settings'    => 'ticker_news_post_filter',
                'priority'  => 50,
                'choices' => array(
                    array(
                        'value' => 'category',
                        'label' => esc_html__('By category', 'newsmatic' )
                    ),
                    array(
                        'value' => 'title',
                        'label' => esc_html__('By title', 'newsmatic' )
                    )
                )
            ))
        );

        // Ticker News categories
        $wp_customize->add_setting( 'ticker_news_categories', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_categories' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Categories_Multiselect_Control( $wp_customize, 'ticker_news_categories', array(
                'label'     => esc_html__( 'Posts Categories', 'newsmatic' ),
                'section'   => 'newsmatic_ticker_news_frontpage_section',
                'settings'  => 'ticker_news_categories',
                'priority'  => 60,
                'choices'   => newsmatic_get_multicheckbox_categories_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'ticker_news_post_filter' )->value() == 'category' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // Ticker News posts
        $wp_customize->add_setting( 'ticker_news_posts', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_posts' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Posts_Multiselect_Control( $wp_customize, 'ticker_news_posts', array(
                'label'     => esc_html__( 'Posts', 'newsmatic' ),
                'section'   => 'newsmatic_ticker_news_frontpage_section',
                'settings'  => 'ticker_news_posts',
                'priority'  => 70,
                'choices'   => newsmatic_get_multicheckbox_posts_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'ticker_news_post_filter' )->value() == 'title' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // Ticker News date filter
        $wp_customize->add_setting( 'ticker_news_date_filter', array(
            'default' => ND\newsmatic_get_customizer_default( 'ticker_news_date_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'ticker_news_date_filter', array(
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'settings'    => 'ticker_news_date_filter',
                'priority'  => 80,
                'choices' => newsmatic_get_date_filter_choices_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'ticker_news_post_filter' )->value() == 'category' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // ticker news image setting heading
        $wp_customize->add_setting( 'ticker_news_image_setting_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'ticker_news_image_setting_header', array(
                'label'	      => esc_html__( 'Image Setting', 'newsmatic' ),
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'priority'  => 80,
                'settings'    => 'ticker_news_image_setting_header'
            ))
        );

        // ticker news image size
        $wp_customize->add_setting( 'ticker_news_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'ticker_news_image_size' )
        ));
        $wp_customize->add_control( 'ticker_news_image_size', array(
            'type'  => 'select',
            'priority'  => 80,
            'section'   => 'newsmatic_ticker_news_frontpage_section',
            'label'     => esc_html__( 'Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array()
        ));

        // Ticker News pre sale
        $wp_customize->add_setting( 'ticker_news_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'ticker_news_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Ticker News Options ?', 'newsmatic' ),
                'section'   => 'newsmatic_ticker_news_frontpage_section',
                'features'  =>  [
                    esc_html__( 'Order By', 'newsmatic' ),
                    esc_html__( 'Show Post thumbnail Image', 'newsmatic' ),
                    esc_html__( 'Number of Posts to Display', 'newsmatic' ),
                    esc_html__( 'Offset', 'newsmatic' ),
                    esc_html__( 'Marquee Settings', 'newsmatic' )
                ],
                'priority'  => 90,
            ))
        );

        // ticker news image setting heading
        $wp_customize->add_setting( 'ticker_news_image_setting_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'ticker_news_image_setting_header', array(
                'label'	      => esc_html__( 'Image Setting', 'newsmatic' ),
                'section'     => 'newsmatic_ticker_news_frontpage_section',
                'priority'  => 80,
                'settings'    => 'ticker_news_image_setting_header'
            ))
        );

        // ticker news image size
        $wp_customize->add_setting( 'ticker_news_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'ticker_news_image_size' )
        ));
        $wp_customize->add_control( 'ticker_news_image_size', array(
            'type'  => 'select',
            'priority'  => 80,
            'section'   => 'newsmatic_ticker_news_frontpage_section',
            'label'     => esc_html__( 'Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array()
        ));
    }
    add_action( 'customize_register', 'newsmatic_customizer_ticker_news_panel', 10 );
endif;

if( !function_exists( 'newsmatic_customizer_main_banner_panel' ) ) :
    /**
     * Register main banner section settings
     * 
     */
    function newsmatic_customizer_main_banner_panel( $wp_customize ) {
        /**
         * Main Banner section
         * 
         */
        $wp_customize->add_section( 'newsmatic_main_banner_section', array(
            'title' => esc_html__( 'Main Banner', 'newsmatic' ),
            'priority'  => 70
        ));

        // main banner section tab
        $wp_customize->add_setting( 'main_banner_section_tab', array(
            'sanitize_callback' => 'sanitize_text_field',
            'default'   => 'general'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Tab_Control( $wp_customize, 'main_banner_section_tab', array(
                'section'     => 'newsmatic_main_banner_section',
                'priority'  => 1,
                'choices'  => array(
                    array(
                        'name'  => 'general',
                        'title'  => esc_html__( 'General', 'newsmatic' )
                    ),
                    array(
                        'name'  => 'design',
                        'title'  => esc_html__( 'Design', 'newsmatic' )
                    )
                )
            ))
        );

        // Main Banner option
        $wp_customize->add_setting( 'main_banner_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'main_banner_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ));
    
        $wp_customize->add_control( 
            new Newsmatic_WP_Toggle_Control( $wp_customize, 'main_banner_option', array(
                'label'	      => esc_html__( 'Show main banner', 'newsmatic' ),
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_option',
                'priority'  => 5
            ))
        );

        // Main Banner Layouts
        $wp_customize->add_setting( 'main_banner_layout', array(
            'default'           => ND\newsmatic_get_customizer_default( 'main_banner_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
        ));
        $wp_customize->add_control( new Newsmatic_WP_Radio_Image_Control(
            $wp_customize, 'main_banner_layout',
            array(
                'section'  => 'newsmatic_main_banner_section',
                'priority' => 10,
                'choices'  => array(
                    'four' => array(
                        'label' => esc_html__( 'Four', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/main_banner_four.png'
                    ),
                    'five' => array(
                        'label' => esc_html__( 'Layout Five', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/main_banner_five.png'
                    )
                )
            )
        ));

        // main banner slider setting heading
        $wp_customize->add_setting( 'main_banner_slider_settings_header', array(
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'main_banner_slider_settings_header', array(
                'label'	      => esc_html__( 'Slider Setting', 'newsmatic' ),
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_slider_settings_header',
                'priority'  => 15,
            ))
        );

        // Main Banner slider orderby
        $wp_customize->add_setting( 'main_banner_slider_order_by', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_slider_order_by' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control'
        ));
        $wp_customize->add_control( 'main_banner_slider_order_by', array(
            'type'      => 'select',
            'section'   => 'newsmatic_main_banner_section',
            'label'     => esc_html__( 'Orderby', 'newsmatic' ),
            'priority'  => 20,
            'choices'   => array(
                'date-desc' => esc_html__( 'Newest - Oldest', 'newsmatic' ),
                'date-asc' => esc_html__( 'Oldest - Newest', 'newsmatic' ),
                'title-asc' => esc_html__( 'A - Z', 'newsmatic' ),
                'title-desc' => esc_html__( 'Z - A', 'newsmatic' ),
                'rand-desc' => esc_html__( 'Random', 'newsmatic' )
            )
        ));

        // main banner posts filter
        $wp_customize->add_setting( 'main_banner_post_filter', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_post_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'main_banner_post_filter', array(
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_post_filter',
                'priority'  => 25,
                'choices' => array(
                    array(
                        'value' => 'category',
                        'label' => esc_html__('By category', 'newsmatic' )
                    ),
                    array(
                        'value' => 'title',
                        'label' => esc_html__('By title', 'newsmatic' )
                    )
                )
            ))
        );
        
        // Main Banner slider categories
        $wp_customize->add_setting( 'main_banner_slider_categories', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_slider_categories' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Categories_Multiselect_Control( $wp_customize, 'main_banner_slider_categories', array(
                'label'     => esc_html__( 'Posts Categories', 'newsmatic' ),
                'section'   => 'newsmatic_main_banner_section',
                'settings'  => 'main_banner_slider_categories',
                'priority'  => 30,
                'choices'   => newsmatic_get_multicheckbox_categories_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_post_filter' )->value() == 'category' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // main banner date filter
        $wp_customize->add_setting( 'main_banner_date_filter', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_date_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'main_banner_date_filter', array(
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_date_filter',
                'priority'  => 35,
                'choices' => newsmatic_get_date_filter_choices_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_post_filter' )->value() == 'category' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // main banner posts
        $wp_customize->add_setting( 'main_banner_posts', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_posts' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Posts_Multiselect_Control( $wp_customize, 'main_banner_posts', array(
                'label'     => esc_html__( 'Posts', 'newsmatic' ),
                'section'   => 'newsmatic_main_banner_section',
                'settings'  => 'main_banner_posts',
                'priority'  => 40,
                'choices'   => newsmatic_get_multicheckbox_posts_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_post_filter' )->value() == 'title' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // main banner image size
        $wp_customize->add_setting( 'banner_slider_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'banner_slider_image_size' )
        ));
        $wp_customize->add_control( 'banner_slider_image_size', array(
            'type'  => 'select',
            'priority'  => 40,
            'section'   => 'newsmatic_main_banner_section',
            'label'     => esc_html__( 'Slider Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array()
        ));

        // slider image border radius
        $wp_customize->add_setting( 'banner_slider_image_border_radius', array(
            'default'   => ND\newsmatic_get_customizer_default( 'banner_slider_image_border_radius' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' =>  'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'banner_slider_image_border_radius', array(
                    'label'	      => esc_html__( 'Image Border Radius', 'newsmatic' ),
                    'section'     => 'newsmatic_main_banner_section',
                    'settings'    => 'banner_slider_image_border_radius',
                    'priority'  => 40,
                    'unit'        => 'px',
                    'input_attrs' => array(
                    'max'         => 100,
                    'min'         => 0,
                    'step'        => 1,
                    'reset' => true
                )
            ))
        );
        
        // Main banner block posts setting heading
        $wp_customize->add_setting( 'main_banner_block_posts_settings_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'main_banner_block_posts_settings_header', array(
                'label'	      => esc_html__( 'Block Posts Setting', 'newsmatic' ),
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_block_posts_settings_header',
                'priority'  => 45,
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'four' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // Main Banner block posts slider orderby
        $wp_customize->add_setting( 'main_banner_block_posts_order_by', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_block_posts_order_by' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control'
        ));
        $wp_customize->add_control( 'main_banner_block_posts_order_by', array(
            'type'      => 'select',
            'section'   => 'newsmatic_main_banner_section',
            'label'     => esc_html__( 'Orderby', 'newsmatic' ),
            'priority'  => 50,
            'choices'   => array(
                'date-desc' => esc_html__( 'Newest - Oldest', 'newsmatic' ),
                'date-asc' => esc_html__( 'Oldest - Newest', 'newsmatic' ),
                'title-asc' => esc_html__( 'A - Z', 'newsmatic' ),
                'title-desc' => esc_html__( 'Z - A', 'newsmatic' ),
                'rand-desc' => esc_html__( 'Random', 'newsmatic' )
            ),
            'active_callback'   => function( $setting ) {
                if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'four' ) {
                    return true;
                }
                return false;
            }
        ));

        // Main Banner block posts categories
        $wp_customize->add_setting( 'main_banner_block_posts_categories', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_block_posts_categories' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Categories_Multiselect_Control( $wp_customize, 'main_banner_block_posts_categories', array(
                'label'     => esc_html__( 'Block posts categories', 'newsmatic' ),
                'section'   => 'newsmatic_main_banner_section',
                'settings'  => 'main_banner_block_posts_categories',
                'priority'  => 55,
                'choices'   => newsmatic_get_multicheckbox_categories_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'four' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );
        
        // main banner image size
        $wp_customize->add_setting( 'banner_slider_block_posts_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'banner_slider_block_posts_image_size' )
        ));
        $wp_customize->add_control( 'banner_slider_block_posts_image_size', array(
            'type'  => 'select',
            'priority'  => 55,
            'section'   => 'newsmatic_main_banner_section',
            'label'     => esc_html__( 'Block Posts Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array(),
            'active_callback'   => function( $setting ) {
                if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'four' ) {
                    return true;
                }
                return false;
            }
        ));

        // slider image border radius
        $wp_customize->add_setting( 'banner_slider_block_posts_image_border_radius', array(
            'default'   => ND\newsmatic_get_customizer_default( 'banner_slider_block_posts_image_border_radius' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' =>  'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'banner_slider_block_posts_image_border_radius', array(
                    'label'	      => esc_html__( 'Trailing Image Border Radius', 'newsmatic' ),
                    'section'     => 'newsmatic_main_banner_section',
                    'settings'    => 'banner_slider_block_posts_image_border_radius',
                    'priority'  => 100,
                    'unit'        => 'px',
                    'input_attrs' => array(
                    'max'         => 100,
                    'min'         => 0,
                    'step'        => 1,
                    'reset' => true,
                    'active_callback'   => function( $setting ) {
                        if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'four' ) {
                            return true;
                        }
                        return false;
                    }
                )
            ))
        );

        // main banner pre sale
        $wp_customize->add_setting( 'main_banner_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'main_banner_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Main Banner Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_main_banner_section',
                'features'  =>  [
                    esc_html__( '5 Banner Layouts', 'newsmatic' ),
                    esc_html__( 'Number of Posts to Display', 'newsmatic' ),
                    esc_html__( 'Offset', 'newsmatic' ),
                    esc_html__( 'Excerpt Length', 'newsmatic' ),
                    esc_html__( 'Slider auto slide, arrows, dots & speed', 'newsmatic' ),
                    esc_html__( 'Slider show post category, date & excerpt', 'newsmatic' ),
                    esc_html__( 'Content Type', 'newsmatic' ),
                    esc_html__( 'Block Posts Categories', 'newsmatic' ),
                    esc_html__( 'Tab Re-order', 'newsmatic' ),
                    esc_html__( 'Content Background', 'newsmatic' ),
                    esc_html__( 'And Many More', 'newsmatic' )
                ],
                'priority'  => 200,
            ))
        );

        // Main banner five trailing posts setting heading
        $wp_customize->add_setting( 'main_banner_five_trailing_posts_settings_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'main_banner_five_trailing_posts_settings_header', array(
                'label'	      => esc_html__( 'Trailing Posts Setting', 'newsmatic' ),
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_five_trailing_posts_settings_header',
                'priority'  => 55,
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // Main banner trailing posts layouts
        $wp_customize->add_setting( 'main_banner_five_trailing_posts_layout', array(
            'default'           => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_posts_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'transport' =>  'postMessage'
        ));
        $wp_customize->add_control( new Newsmatic_WP_Radio_Image_Control(
            $wp_customize, 'main_banner_five_trailing_posts_layout',
            array(
                'section'  => 'newsmatic_main_banner_section',
                'priority'  => 55,
                'choices'  => array(
                    'row' => array(
                        'label' => esc_html__( 'Row Layout', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/main_banner_five_trailing_posts_layout_row.png'
                    ),
                    'column' => array(
                        'label' => esc_html__( 'Column Layout', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/main_banner_five_trailing_posts_layout_column.png'
                    )
                ),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' ) {
                        return true;
                    }
                    return false;
                }
            )
        ));
        
        // Main banner five trailing posts slider orderby
        $wp_customize->add_setting( 'main_banner_five_trailing_posts_order_by', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_posts_order_by' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control'
        ));
        $wp_customize->add_control( 'main_banner_five_trailing_posts_order_by', array(
            'type'      => 'select',
            'section'   => 'newsmatic_main_banner_section',
            'priority'  => 55,
            'label'     => esc_html__( 'Orderby', 'newsmatic' ),
            'choices'   => array(
                'date-desc' => esc_html__( 'Newest - Oldest', 'newsmatic' ),
                'date-asc' => esc_html__( 'Oldest - Newest', 'newsmatic' ),
                'title-asc' => esc_html__( 'A - Z', 'newsmatic' ),
                'title-desc' => esc_html__( 'Z - A', 'newsmatic' ),
                'rand-desc' => esc_html__( 'Random', 'newsmatic' )
            ),
            'active_callback'   => function( $setting ) {
                if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' ) {
                    return true;
                }
                return false;
            }
        ));

        // main banner posts filter
        $wp_customize->add_setting( 'main_banner_five_trailing_post_filter', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_post_filter' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Bubble_Control( $wp_customize, 'main_banner_five_trailing_post_filter', array(
                'section'     => 'newsmatic_main_banner_section',
                'settings'    => 'main_banner_five_trailing_post_filter',
                'priority'  => 55,
                'choices' => array(
                    array(
                        'value' => 'category',
                        'label' => esc_html__( 'By category', 'newsmatic' )
                    ),
                    array(
                        'value' => 'title',
                        'label' => esc_html__( 'By title', 'newsmatic' )
                    )
                ),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // Main banner five trailing posts categories
        $wp_customize->add_setting( 'main_banner_five_trailing_posts_categories', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_posts_categories' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Categories_Multiselect_Control( $wp_customize, 'main_banner_five_trailing_posts_categories', array(
                'label'     => esc_html__( 'Trailing posts categories', 'newsmatic' ),
                'section'   => 'newsmatic_main_banner_section',
                'settings'  => 'main_banner_five_trailing_posts_categories',
                'priority'  => 55,
                'choices'   => newsmatic_get_multicheckbox_categories_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' && $setting->manager->get_setting( 'main_banner_five_trailing_post_filter' )->value() == 'category' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );

        // main banner posts
        $wp_customize->add_setting( 'main_banner_five_trailing_posts', array(
            'default' => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_posts' ),
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Posts_Multiselect_Control( $wp_customize, 'main_banner_five_trailing_posts', array(
                'label'     => esc_html__( 'Posts', 'newsmatic' ),
                'section'   => 'newsmatic_main_banner_section',
                'settings'  => 'main_banner_five_trailing_posts',
                'priority'  => 55, 
                'choices'   => newsmatic_get_multicheckbox_posts_simple_array(),
                'active_callback'   => function( $setting ) {
                    if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' && $setting->manager->get_setting( 'main_banner_five_trailing_post_filter' )->value() == 'title' ) {
                        return true;
                    }
                    return false;
                }
            ))
        );
        
        // main banner five trailing posts image size
        $wp_customize->add_setting( 'main_banner_five_trailing_posts_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'main_banner_five_trailing_posts_image_size' )
        ));
        $wp_customize->add_control( 'main_banner_five_trailing_posts_image_size', array(
            'type'  => 'select',
            'priority'  => 55,
            'section'   => 'newsmatic_main_banner_section',
            'label'     => esc_html__( 'Trailing Posts Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array(),
            'active_callback'   => function( $setting ) {
                if ( $setting->manager->get_setting( 'main_banner_layout' )->value() === 'five' ) {
                    return true;
                }
                return false;
            }
        ));

        // banner section order
        $wp_customize->add_setting( 'banner_section_order', array(
            'default'   => ND\newsmatic_get_customizer_default( 'banner_section_order' ),
            'sanitize_callback' => 'newsmatic_sanitize_sortable_control'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Item_Sortable_Control( $wp_customize, 'banner_section_order', array(
                'label'         => esc_html__( 'Column Re-order', 'newsmatic' ),
                'section'       => 'newsmatic_main_banner_section',
                'settings'      => 'banner_section_order',
                'tab'   => 'design',
                'fields'    => array(
                    'banner_slider'  => array(
                        'label' => esc_html__( 'Banner Slider Column', 'newsmatic' )
                    ),
                    'tab_slider'  => array(
                        'label' => esc_html__( 'Grid Trailing Posts', 'newsmatic' )
                    )
                )
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_main_banner_panel', 10 );
endif;

if( !function_exists( 'newsmatic_customizer_front_sections_panel' ) ) :
    /**
     * Register front sections settings
     * 
     */
    function newsmatic_customizer_front_sections_panel( $wp_customize ) {
        // Front sections panel
        $wp_customize->add_panel( 'newsmatic_front_sections_panel', array(
            'title' => esc_html__( 'Front sections', 'newsmatic' ),
            'priority'  => 71
        ));

        // full width content section
        $wp_customize->add_section( 'newsmatic_full_width_section', array(
            'title' => esc_html__( 'Full Width', 'newsmatic' ),
            'panel' => 'newsmatic_front_sections_panel',
            'priority'  => 10
        ));

        // full width repeater control
        $wp_customize->add_setting( 'full_width_blocks', array(
            'default'   => ND\newsmatic_get_customizer_default( 'full_width_blocks' ),
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control'
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Block_Repeater_Control( $wp_customize, 'full_width_blocks', array(
                'label'	      => esc_html__( 'Blocks to show in this section', 'newsmatic' ),
                'description' => esc_html__( 'Hold bar icon at right of block item and drag vertically to re-order blocks', 'newsmatic' ),
                'section'     => 'newsmatic_full_width_section',
                'priority'     => 10,
                'settings'    => 'full_width_blocks'
            ))
        );

        // Full width pre sale
        $wp_customize->add_setting( 'full_width_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'full_width_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Full Width Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_full_width_section',
                'features'  =>  [
                    esc_html__( 'Unlimited sections', 'newsmatic' ),
                    esc_html__( 'Content & Section Background', 'newsmatic' ),
                    esc_html__( 'Video Playlist', 'newsmatic' ),
                ]
            ))
        );

        // Left content -right sidebar section
        $wp_customize->add_section( 'newsmatic_leftc_rights_section', array(
            'title' => esc_html__( 'Left Content  - Right Sidebar', 'newsmatic' ),
            'panel' => 'newsmatic_front_sections_panel',
            'priority'  => 10
        ));

        // redirect to manage sidebar
        $wp_customize->add_setting( 'leftc_rights_section_sidebar_redirect', array(
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
        ));
    
        $wp_customize->add_control( 
            new Newsmatic_WP_Redirect_Control( $wp_customize, 'leftc_rights_section_sidebar_redirect', array(
                'label'	      => esc_html__( 'Widgets', 'newsmatic' ),
                'section'     => 'newsmatic_leftc_rights_section',
                'settings'    => 'leftc_rights_section_sidebar_redirect',
                'tab'   => 'general',
                'priority'  => 5,
                'choices'     => array(
                    'footer-column-one' => array(
                        'type'  => 'section',
                        'id'    => 'sidebar-widgets-front-right-sidebar',
                        'label' => esc_html__( 'Manage right sidebar', 'newsmatic' )
                    )
                )
            ))
        );

        // Block Repeater control
        $wp_customize->add_setting( 'leftc_rights_blocks', array(
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'default'   => ND\newsmatic_get_customizer_default( 'leftc_rights_blocks' )
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Block_Repeater_Control( $wp_customize, 'leftc_rights_blocks', array(
                'label'	      => esc_html__( 'Blocks to show in this section', 'newsmatic' ),
                'description' => esc_html__( 'Hold bar icon at right of block item and drag vertically to re-order blocks', 'newsmatic' ),
                'section'     => 'newsmatic_leftc_rights_section',
                'priority'  => 10,
                'settings'    => 'leftc_rights_blocks'
            ))
        );

        // Left Content - Right sidebar pre sale
        $wp_customize->add_setting( 'leftc_rights_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'leftc_rights_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Left Content Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_leftc_rights_section',
                'features'  =>  [
                    esc_html__( 'Unlimited sections', 'newsmatic' ),
                    esc_html__( 'Content & Section Background', 'newsmatic' ),
                    esc_html__( 'Video Playlist', 'newsmatic' ),
                ]
            ))
        );

        /**
         * Left sidebar - Right content section
         * 
         */
        $wp_customize->add_section( 'newsmatic_lefts_rightc_section', array(
            'title' => esc_html__( 'Left Sidebar - Right Content', 'newsmatic' ),
            'panel' => 'newsmatic_front_sections_panel',
            'priority'  => 10
        ));

        // redirect to manage sidebar
        $wp_customize->add_setting( 'lefts_rightc_section_sidebar_redirect', array(
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Redirect_Control( $wp_customize, 'lefts_rightc_section_sidebar_redirect', array(
                'label'	      => esc_html__( 'Widgets', 'newsmatic' ),
                'section'     => 'newsmatic_lefts_rightc_section',
                'settings'    => 'lefts_rightc_section_sidebar_redirect',
                'tab'   => 'general',
                'priority'  => 5,
                'choices'     => array(
                    'footer-column-one' => array(
                        'type'  => 'section',
                        'id'    => 'sidebar-widgets-front-left-sidebar',
                        'label' => esc_html__( 'Manage left sidebar', 'newsmatic' )
                    )
                )
            ))
        );

        // Block Repeater control
        $wp_customize->add_setting( 'lefts_rightc_blocks', array(
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'default'   => ND\newsmatic_get_customizer_default( 'lefts_rightc_blocks' )
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Block_Repeater_Control( $wp_customize, 'lefts_rightc_blocks', array(
                'label'	      => esc_html__( 'Blocks to show in this section', 'newsmatic' ),
                'priority'  => 10,
                'description' => esc_html__( 'Hold bar icon at right of block item and drag vertically to re-order blocks', 'newsmatic' ),
                'section'     => 'newsmatic_lefts_rightc_section',
                'settings'    => 'lefts_rightc_blocks'
            ))
        );

        // Left sidebar - Right content pre sale
        $wp_customize->add_setting( 'lefts_rightc_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'lefts_rightc_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Right Content Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_lefts_rightc_section',
                'features'  =>  [
                    esc_html__( 'Unlimited sections', 'newsmatic' ),
                    esc_html__( 'Content & Section Background', 'newsmatic' ),
                    esc_html__( 'Video Playlist', 'newsmatic' ),
                ]
            ))
        );

        // Bottom Full Width content section
        $wp_customize->add_section( 'newsmatic_bottom_full_width_section', array(
            'title' => esc_html__( 'Bottom Full Width', 'newsmatic' ),
            'panel' => 'newsmatic_front_sections_panel',
            'priority'  => 50
        ));

        // bottom full width blocks control
        $wp_customize->add_setting( 'bottom_full_width_blocks', array(
            'sanitize_callback' => 'newsmatic_sanitize_repeater_control',
            'default'   => ND\newsmatic_get_customizer_default( 'bottom_full_width_blocks' )
        ));
        
        $wp_customize->add_control( 
            new Newsmatic_WP_Block_Repeater_Control( $wp_customize, 'bottom_full_width_blocks', array(
                'label'	      => esc_html__( 'Blocks to show in this section', 'newsmatic' ),
                'description' => esc_html__( 'Hold bar icon at right of block item and drag vertically to re-order blocks', 'newsmatic' ),
                'section'     => 'newsmatic_bottom_full_width_section',
                'priority'  => 10,
                'settings'    => 'bottom_full_width_blocks'
            ))
        );

        // bottom full width pre sale
        $wp_customize->add_setting( 'bottom_full_width_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'bottom_full_width_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Bottom Full Width Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_bottom_full_width_section',
                'features'  =>  [
                    esc_html__( 'Unlimited sections', 'newsmatic' ),
                    esc_html__( 'Content & Section Background', 'newsmatic' ),
                    esc_html__( 'Video Playlist', 'newsmatic' ),
                ]
            ))
        );

        // front sections reorder section
        $wp_customize->add_section( 'newsmatic_front_sections_reorder_section', array(
            'title' => esc_html__( 'Reorder sections', 'newsmatic' ),
            'panel' => 'newsmatic_front_sections_panel',
            'priority'  => 60
        ));

        /**
         * Frontpage sections options
         * 
         * @package Newsmatic
         * @since 1.0.0
         */
        $wp_customize->add_setting( 'homepage_content_order', array(
            'default'   => ND\newsmatic_get_customizer_default( 'homepage_content_order' ),
            'sanitize_callback' => 'newsmatic_sanitize_sortable_control'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Item_Sortable_Control( $wp_customize, 'homepage_content_order', array(
                'label'         => esc_html__( 'Section Re-order', 'newsmatic' ),
                'description'   => esc_html__( 'Hold item and drag vertically to re-order the items', 'newsmatic' ),
                'section'       => 'newsmatic_front_sections_reorder_section',
                'settings'      => 'homepage_content_order',
                'priority'  => 30,
                'fields'    => array(
                    'full_width_section'  => array(
                        'label' => esc_html__( 'Full width Section', 'newsmatic' )
                    ),
                    'leftc_rights_section'  => array(
                        'label' => esc_html__( 'Left Content - Right Sidebar', 'newsmatic' )
                    ),
                    'lefts_rightc_section'  => array(
                        'label' => esc_html__( 'Left Sidebar - Right Content', 'newsmatic' )
                    ),
                    'bottom_full_width_section'  => array(
                        'label' => esc_html__( 'Bottom Full width Section', 'newsmatic' )
                    ),
                    'latest_posts'  => array(
                        'label' => esc_html__( 'Latest Posts / Page Content', 'newsmatic' )
                    )
                )
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_front_sections_panel', 10 );
endif;

if( !function_exists( 'newsmatic_customizer_blog_post_archive_panel' ) ) :
    /**
     * Register global options settings
     * 
     */
    function newsmatic_customizer_blog_post_archive_panel( $wp_customize ) {
        // Blog/Archive/Single panel
        $wp_customize->add_panel( 'newsmatic_blog_post_archive_panel', array(
            'title' => esc_html__( 'Blog / Archive / Single', 'newsmatic' ),
            'priority'  => 72
        ));
        
        // blog / archive section
        $wp_customize->add_section( 'newsmatic_blog_archive_section', array(
            'title' => esc_html__( 'Blog / Archive', 'newsmatic' ),
            'panel' => 'newsmatic_blog_post_archive_panel',
            'priority'  => 10
        ));

        // archive post layouts
        $wp_customize->add_setting( 'archive_page_layout',
            array(
            'default'           => ND\newsmatic_get_customizer_default( 'archive_page_layout' ),
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'transport' =>  'postMessage'
            )
        );
        $wp_customize->add_control( 
            new Newsmatic_WP_Radio_Image_Control( $wp_customize, 'archive_page_layout', array(
                'section'  => 'newsmatic_blog_archive_section',
                'priority' => 10,
                'choices'  => array(
                    'one' => array(
                        'label' => esc_html__( 'Layout One', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/archive_one.png'
                    ),
                    'two' => array(
                        'label' => esc_html__( 'Layout Two', 'newsmatic' ),
                        'url'   => '%s/assets/images/customizer/archive_two.png'
                    )
                )
            )
        ));

        // archive title prefix option
        $wp_customize->add_setting( 'archive_page_title_prefix', array(
            'default' => ND\newsmatic_get_customizer_default( 'archive_page_title_prefix' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'archive_page_title_prefix', array(
                'label'	      => esc_html__( 'Show archive title prefix', 'newsmatic' ),
                'priority'    => 30,
                'section'     => 'newsmatic_blog_archive_section',
                'settings'    => 'archive_page_title_prefix'
            ))
        );
        // Redirect continue reading button
        $wp_customize->add_setting( 'archive_button_redirect', array(
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Redirect_Control( $wp_customize, 'archive_button_redirect', array(
                'section'     => 'newsmatic_blog_archive_section',
                'priority'    => 40,
                'settings'    => 'archive_button_redirect',
                'choices'     => array(
                    'header-social-icons' => array(
                        'type'  => 'section',
                        'id'    => 'newsmatic_buttons_section',
                        'label' => esc_html__( 'Edit button styles', 'newsmatic' )
                    )
                )
            ))
        );

        // single post related news heading
        $wp_customize->add_setting( 'archive_page_image_setting_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'archive_page_image_setting_header', array(
                'label'	      => esc_html__( 'Image Setting', 'newsmatic' ),
                'section'     => 'newsmatic_blog_archive_section',
                'priority'    => 40,
                'settings'    => 'archive_page_image_setting_header'
            ))
        );

        // archive image size
        $wp_customize->add_setting( 'archive_page_image_size', array(
            'sanitize_callback' => 'newsmatic_sanitize_select_control',
            'default'   => ND\newsmatic_get_customizer_default( 'archive_page_image_size' )
        ));
        $wp_customize->add_control( 'archive_page_image_size', array(
            'type'  => 'select',
            'priority'  => 40,
            'section'   => 'newsmatic_blog_archive_section',
            'label'     => esc_html__( 'Image Size', 'newsmatic' ),
            'choices'   => newsmatic_get_image_sizes_option_array()
        ));

        // archive image ratio
        $wp_customize->add_setting( 'archive_page_image_ratio', array(
            'default'   => ND\newsmatic_get_customizer_default( 'archive_page_image_ratio' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' =>  'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'archive_page_image_ratio', array(
                    'label'	      => esc_html__( 'Image Ratio', 'newsmatic' ),
                    'priority'  => 40,
                    'section'     => 'newsmatic_blog_archive_section',
                    'settings'    => 'archive_page_image_ratio',
                    'unit'        => '%',
                    'input_attrs' => array(
                    'max'         => 2,
                    'min'         => 0,
                    'step'        => 0.1,
                    'reset' => true
                )
            ))
        );

        // archive image border radius
        $wp_customize->add_setting( 'archive_page_image_border_radius', array(
            'default'   => ND\newsmatic_get_customizer_default( 'archive_page_image_border_radius' ),
            'sanitize_callback' => 'newsmatic_sanitize_responsive_range',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control(
            new Newsmatic_WP_Responsive_Range_Control( $wp_customize, 'archive_page_image_border_radius', array(
                    'label'	      => esc_html__( 'Image Border Radius', 'newsmatic' ),
                    'section'     => 'newsmatic_blog_archive_section',
                    'settings'    => 'archive_page_image_border_radius',
                    'priority'  => 40,
                    'unit'        => 'px',
                    'input_attrs' => array(
                    'max'         => 100,
                    'min'         => 0,
                    'step'        => 1,
                    'reset' => true
                )
            ))
        );

        // Archive pre sale
        $wp_customize->add_setting( 'archive_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'archive_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Archive Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_blog_archive_section',
                'features'  =>  [
                    esc_html__( '5 Layouts', 'newsmatic' ),
                    esc_html__( 'Excerpt Length', 'newsmatic' ),
                    esc_html__( 'Pagination Type', 'newsmatic' ),
                    esc_html__( 'Elements Re-order', 'newsmatic' ),
                    esc_html__( 'Meta Re-order', 'newsmatic' ),
                    esc_html__( 'Content Background', 'newsmatic' ),
                    esc_html__( 'More than 1500+ google fonts', 'newsmatic' )
                ]
            ))
        );

        //  single post section
        $wp_customize->add_section( 'newsmatic_single_post_section', array(
            'title' => esc_html__( 'Single Post', 'newsmatic' ),
            'panel' => 'newsmatic_blog_post_archive_panel',
            'priority'  => 20
        ));

        // single post related news heading
        $wp_customize->add_setting( 'single_post_related_posts_header', array(
            'sanitize_callback' => 'sanitize_text_field'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Section_Heading_Control( $wp_customize, 'single_post_related_posts_header', array(
                'label'	      => esc_html__( 'Related News', 'newsmatic' ),
                'section'     => 'newsmatic_single_post_section',
                'settings'    => 'single_post_related_posts_header'
            ))
        );

        // related news option
        $wp_customize->add_setting( 'single_post_related_posts_option', array(
            'default'   => ND\newsmatic_get_customizer_default( 'single_post_related_posts_option' ),
            'sanitize_callback' => 'newsmatic_sanitize_toggle_control',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 
            new Newsmatic_WP_Simple_Toggle_Control( $wp_customize, 'single_post_related_posts_option', array(
                'label'	      => esc_html__( 'Show related news', 'newsmatic' ),
                'section'     => 'newsmatic_single_post_section',
                'settings'    => 'single_post_related_posts_option'
            ))
        );

        // related news title
        $wp_customize->add_setting( 'single_post_related_posts_title', array(
            'default' => ND\newsmatic_get_customizer_default( 'single_post_related_posts_title' ),
            'sanitize_callback' => 'sanitize_text_field',
            'transport' => 'postMessage'
        ));
        $wp_customize->add_control( 'single_post_related_posts_title', array(
            'type'      => 'text',
            'section'   => 'newsmatic_single_post_section',
            'label'     => esc_html__( 'Related news title', 'newsmatic' )
        ));
    }
    add_action( 'customize_register', 'newsmatic_customizer_blog_post_archive_panel', 10 );
endif;

if( !function_exists( 'newsmatic_customizer_page_panel' ) ) :
    /**
     * Register global options settings
     * 
     */
    function newsmatic_customizer_page_panel( $wp_customize ) {
        // page panel
        $wp_customize->add_panel( 'newsmatic_page_panel', array(
            'title' => esc_html__( 'Pages', 'newsmatic' ),
            'priority'  => 73
        ));
        
        // 404 section
        $wp_customize->add_section( 'newsmatic_404_section', array(
            'title' => esc_html__( '404', 'newsmatic' ),
            'panel' => 'newsmatic_page_panel',
            'priority'  => 20
        ));
        // 404 image field
        $wp_customize->add_setting( 'error_page_image', array(
            'default' => ND\newsmatic_get_customizer_default( 'error_page_image' ),
            'sanitize_callback' => 'absint',
        ));
        $wp_customize->add_control(new WP_Customize_Media_Control($wp_customize, 'error_page_image', array(
            'section' => 'newsmatic_404_section',
            'mime_type' => 'image',
            'label' => esc_html__( '404 Image', 'newsmatic' ),
            'description' => esc_html__( 'Upload image that shows you are on 404 error page', 'newsmatic' )
        )));

        // 404 page pre sale
        $wp_customize->add_setting( '404_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, '404_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More 404 Options ?', 'newsmatic' ),
                'section' => 'newsmatic_404_section',
                'features'  =>  [
                    esc_html__( '404 page & content title', 'newsmatic' ),
                    esc_html__( 'Button label & Url', 'newsmatic' ),
                    esc_html__( 'Content Background', 'newsmatic' ),
                    esc_html__( 'Search page settings', 'newsmatic' ),
                ]
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_page_panel', 10 );
endif;

require get_template_directory() . '/inc/customizer/footer-builders.php';

// extract to the customizer js
$newsmaticAddAction = function() {
    $action_prefix = "wp_ajax_" . "newsmatic_";
    // retrieve posts with search key
    add_action( $action_prefix . 'get_multicheckbox_posts_simple_array', function() {
        check_ajax_referer( 'newsmatic-customizer-controls-live-nonce', 'security' );
        $searchKey = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])): '';
        $posts_list = get_posts(array('numberposts'=>-1, 's'=>esc_html($searchKey)));
        $posts_array = [];
        foreach( $posts_list as $postItem ) :
            $posts_array[] = array( 
                'value'	=> esc_html( $postItem->post_name ),
                'label'	=> esc_html(str_replace(array('\'', '"'), '', $postItem->post_title))
            );
        endforeach;
        wp_send_json_success($posts_array);
        wp_die();
    });
    // retrieve categories with search key
    add_action( $action_prefix . 'get_multicheckbox_categories_simple_array', function() {
        check_ajax_referer( 'newsmatic-customizer-controls-live-nonce', 'security' );
        $searchKey = isset($_POST['search']) ? sanitize_text_field(wp_unslash($_POST['search'])): '';
        $categories_list = get_categories(array('number'=>-1, 'search'=>esc_html($searchKey)));
        $categories_array = [];
        foreach( $categories_list as $categoryItem ) :
            $categories_array[] = array( 
                'value'	=> esc_html( $categoryItem->slug ),
                'label'	=> esc_html(str_replace(array('\'', '"'), '', $categoryItem->name)) . ' (' . absint( $categoryItem->count ) . ')'
            );
        endforeach;
        wp_send_json_success($categories_array);
        wp_die();
    });
    // typography fonts url
    add_action( $action_prefix . 'typography_fonts_url', function() {
        check_ajax_referer( 'newsmatic-customizer-nonce', 'security' );
		// enqueue inline style
		ob_start();
			echo esc_url( newsmatic_typo_fonts_url() );
        $newsmatic_typography_fonts_url = ob_get_clean();
		echo apply_filters( 'newsmatic_typography_fonts_url', esc_url($newsmatic_typography_fonts_url) );
		wp_die();
	});
};
$newsmaticAddAction();