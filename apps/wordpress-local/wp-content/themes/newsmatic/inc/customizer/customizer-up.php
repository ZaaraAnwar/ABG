<?php
/**
 * Handles the customizer additional functionality.
 */
if( !function_exists( 'newsmatic_customizer_up_panel' ) ) :
    /**
     * Register controls for upsell, notifications and addtional info.
     * 
     */
    function newsmatic_customizer_up_panel( $wp_customize ) {
        $wp_customize->add_setting( 'social_icons_upgrade_info', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'social_icons_upgrade_info', array(
                'label'	      => esc_html__( 'Need More Social Icons Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'social_icons_section',
                'features'  =>  [
                    esc_html__( 'Unlimited social icons items with unlimited choices', 'newsmatic' )
                ]
            ))
        );

        // Preloader pre sale
        $wp_customize->add_setting( 'preloader_upgrade_info', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'preloader_upgrade_info', array(
                'label'	      => esc_html__( 'Need More Preloader Options ?', 'newsmatic' ),
                'section'     => 'newsmatic_preloader_section',
                'features'  =>  [
                    esc_html__( '20+ Preloader', 'newsmatic' )
                ]
            ))
        );

        // single post pre sale
        $wp_customize->add_setting( 'single_post_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'single_post_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Single Post Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'single_post_section',
                'features'  =>  [
                    esc_html__( 'Breadcrumb Position', 'newsmatic' ),
                    esc_html__( 'Elements Re-order', 'newsmatic' ),
                    esc_html__( 'Meta Re-order', 'newsmatic' ),
                    esc_html__( 'Related News 2 Layouts', 'newsmatic' ),
                    esc_html__( 'Related News Filter By', 'newsmatic' ),
                    esc_html__( 'Related News Number of Posts', 'newsmatic' ),
                    esc_html__( 'Related News show image', 'newsmatic' ),
                    esc_html__( 'Related News show in popup box', 'newsmatic' ),
                    esc_html__( 'content Background', 'newsmatic' ),
                    esc_html__( 'Post Title, Meta & Content Typography ', 'newsmatic' ),
                    esc_html__( 'More than 1500+ google fonts', 'newsmatic' )
                ]
            ))
        );

        // Preloader pre sale
        $wp_customize->add_setting( 'main_header_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'main_header_', array(
                'label'	      => esc_html__( 'Need More Main Header Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'main_header_section',
                'features'  =>  [
                    esc_html__( '2 Layouts', 'newsmatic' ),
                    esc_html__( 'Width Layout', 'newsmatic' ),
                    esc_html__( 'Sidebar Background', 'newsmatic' )
                ]
            ))
        );

        // menu options pre sale
        $wp_customize->add_setting( 'menu_options_section_pre_sales', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'menu_options_section_pre_sales', array(
                'label'	      => esc_html__( 'Need More Menu Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'header_menu_option_section',
                'features'  =>  [
                    esc_html__( 'Active Menu Color & Background', 'newsmatic' ),
                    esc_html__( 'Sub Menu Color & Background', 'newsmatic' ),
                    esc_html__( 'Mobile Menu Toggle Color', 'newsmatic' ),
                    esc_html__( 'Border Bottom', 'newsmatic' ),
                    esc_html__( 'Main & Sub Menu Typography', 'newsmatic' )
                ]
            ))
        );

        // theme footer pre sale
        $wp_customize->add_setting( 'footer_upgrade_info', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'footer_upgrade_info', array(
                'label'	      => esc_html__( 'Need More Theme Footer Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'footer_section',
                'features'  =>  [
                    esc_html__( 'Text Color', 'newsmatic' ),
                    esc_html__( 'Background color', 'newsmatic' ),
                    esc_html__( 'More than 1500+ google fonts', 'newsmatic' )
                ]
            ))
        );

        // bottom theme footer pre sale
        $wp_customize->add_setting( 'bottom_footer_upgrade_info', [
            'sanitize_callback' => 'sanitize_text_field'
        ]);
        $wp_customize->add_control( 
            new Newsmatic_WP_Upsell_Control( $wp_customize, 'bottom_footer_upgrade_info', array(
                'label'	      => esc_html__( 'Need More Bottom Theme Footer Options ?', 'newsmatic' ),
                'section'     => NEWSMATIC_PREFIX . 'bottom_footer_section',
                'features'  =>  [
                    esc_html__( 'Show Bottom Social Icons', 'newsmatic' ),
                    esc_html__( 'WYSIWYG Editor', 'newsmatic' ),
                    esc_html__( 'Text & Link Color', 'newsmatic' ),
                    esc_html__( 'Background Color', 'newsmatic' ),
                ]
            ))
        );
    }
    add_action( 'customize_register', 'newsmatic_customizer_up_panel', 20 );
endif;