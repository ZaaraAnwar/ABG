<?php
/**
 * Includes theme defaults and starter functions
 * 
 * @package Newsmatic
 * @since 1.0.0
 */
 namespace Newsmatic\CustomizerDefault;

 if( !function_exists( 'newsmatic_get_customizer_option' ) ) :
    /**
     * Gets customizer "theme_mods" value
     * 
     * @package Newsmatic
     * @since 1.0.0
     * 
     */
    function newsmatic_get_customizer_option( $key ) {
        return get_theme_mod( $key, newsmatic_get_customizer_default( $key ) );
    }
 endif;

 if( !function_exists( 'newsmatic_get_multiselect_tab_option' ) ) :
    /**
     * Gets customizer "multiselect combine tab" value
     * 
     * @package Newsmatic
     * @since 1.0.0
     */
    function newsmatic_get_multiselect_tab_option( $key ) {
        $value = newsmatic_get_customizer_option( $key );
        if( !$value["desktop"] && !$value["tablet"] && !$value["mobile"] ) return apply_filters( "newsmatic_get_multiselect_tab_option", false );
        return apply_filters( "newsmatic_get_multiselect_tab_option", true );
    }
 endif;

  if( ! function_exists( 'newsmatic_has_theme_mod' ) ) :
    /**
     * Check if theme mod exists
     * 
     * @since 1.4.0
     */
    function newsmatic_has_theme_mod( $control_id, $default_value ) {
        $mods = get_theme_mods();
        $value = isset( $mods[ $control_id ] );
        if( $value ) :
            $current_value = get_theme_mod( $control_id, $default_value );
            return $current_value;
        else:
            return true;
        endif;
        
    }
 endif;

 if( !function_exists( 'newsmatic_get_customizer_default' ) ) :
    /**
     * Gets customizer "theme_mods" value
     * 
     * @package Newsmatic
     * @since 1.0.0
     */
    function newsmatic_get_customizer_default($key) {
        $is_header_layout_two = ( get_theme_mod( 'header_layout', 'one' ) === 'two' );
        $footer_social_icons = get_theme_mod( 'bottom_footer_social_option', false );
        $footer_menu = get_theme_mod( 'bottom_footer_menu_option', false );

        $array_defaults = apply_filters( 'newsmatic_get_customizer_defaults', array(
            'theme_color'   => '#1B8415',
            'site_background_color'  => json_encode(array(
                'type'  => 'solid',
                'solid' => '#F0F1F2',
                'gradient'  => null
            )),
            'global_button_text'    => array( "icon"  => "fas fa-angle-right", "text"   => esc_html__( 'Read More', 'newsmatic' ) ),
            'preloader_option'  => false,
            'website_layout'    => 'full-width--layout',
            'website_block_border_top_option' => true,
            'website_block_border_top_color' => json_encode(array(
                'type'  => 'solid',
                'solid' => '#1b8415',
                'gradient'  => 'linear-gradient( 135deg, #485563 10%, #29323c 100%)'
            )),
            'frontpage_sidebar_layout'  => 'right-sidebar',
            'frontpage_sidebar_sticky_option'    => false,
            'archive_sidebar_layout'    => 'right-sidebar',
            'archive_sidebar_sticky_option'    => false,
            'single_sidebar_layout' => 'right-sidebar',
            'single_sidebar_sticky_option'    => false,
            'page_sidebar_layout'   => 'right-sidebar',
            'page_sidebar_sticky_option'    => false,
            'preset_color_1'    => '#64748b',
            'preset_color_2'    => '#27272a',
            'preset_color_3'    => '#ef4444',
            'preset_color_4'    => '#eab308',
            'preset_color_5'    => '#84cc16',
            'preset_color_6'    => '#22c55e',
            'preset_color_7'    => '#06b6d4',
            'preset_color_8'    => '#0284c7',
            'preset_color_9'    => '#6366f1',
            'preset_color_10'    => '#84cc16',
            'preset_color_11'    => '#a855f7',
            'preset_color_12'    => '#f43f5e',
            'preset_gradient_1'   => 'linear-gradient( 135deg, #485563 10%, #29323c 100%)',
            'preset_gradient_2' => 'linear-gradient( 135deg, #FF512F 10%, #F09819 100%)',
            'preset_gradient_3'  => 'linear-gradient( 135deg, #00416A 10%, #E4E5E6 100%)',
            'preset_gradient_4'   => 'linear-gradient( 135deg, #CE9FFC 10%, #7367F0 100%)',
            'preset_gradient_5' => 'linear-gradient( 135deg, #90F7EC 10%, #32CCBC 100%)',
            'preset_gradient_6'  => 'linear-gradient( 135deg, #81FBB8 10%, #28C76F 100%)',
            'preset_gradient_7'   => 'linear-gradient( 135deg, #EB3349 10%, #F45C43 100%)',
            'preset_gradient_8' => 'linear-gradient( 135deg, #FFF720 10%, #3CD500 100%)',
            'preset_gradient_9'  => 'linear-gradient( 135deg, #FF96F9 10%, #C32BAC 100%)',
            'preset_gradient_10'   => 'linear-gradient( 135deg, #69FF97 10%, #00E4FF 100%)',
            'preset_gradient_11' => 'linear-gradient( 135deg, #3C8CE7 10%, #00EAFF 100%)',
            'preset_gradient_12'  => 'linear-gradient( 135deg, #FF7AF5 10%, #513162 100%)',
            'post_title_hover_effects'  => 'two',
            'site_image_hover_effects'  => 'two',
            'site_breadcrumb_option'    => true,
            'site_breadcrumb_type'  => 'default',
            'site_breadcrumb_hook_on'   => 'main_container',
            'site_schema_ready' => true,
            'site_date_format'  => 'theme_format',
            'site_date_to_show' => 'published',
            'site_title_hover_textcolor'=> '#1B8415',
            'site_description_color'    => '#8f8f8f',
            'homepage_content_order'    => array( 
                array( 'value'  => 'full_width_section', 'option'   => false ),
                array( 'value'  => 'leftc_rights_section', 'option'    => false ),
                array( 'value'   => 'lefts_rightc_section', 'option' => false ),
                array( 'value'   => 'latest_posts', 'option'    => true ),
                array( 'value' => 'bottom_full_width_section', 'option'  => true )
            ),
            'newsmatic_site_logo_width'    => array(
                'desktop'   => 230,
                'tablet'    => 200,
                'smartphone'    => 200
            ),
            'site_title_typo'    => array(
                'font_family'   => array( 'value' => 'Roboto', 'label' => 'Roboto' ),
                'font_weight'   => array( 'value' => '700', 'label' => 'Bold 700' ),
                'font_size'   => array(
                    'desktop' => 45,
                    'tablet' => 43,
                    'smartphone' => 40
                ),
                'line_height'   => array(
                    'desktop' => 45,
                    'tablet' => 42,
                    'smartphone' => 40,
                ),
                'letter_spacing'   => array(
                    'desktop' => 0,
                    'tablet' => 0,
                    'smartphone' => 0
                ),
                'text_transform'    => 'capitalize',
                'text_decoration'    => 'none',
            ),
            'site_tagline_typo'    => array(
                'font_family'   => array( 'value' => 'Roboto', 'label' => 'Roboto' ),
                'font_weight'   => array( 'value' => '400', 'label' => 'Regular 400' ),
                'font_size'   => array(
                    'desktop' => 16,
                    'tablet' => 16,
                    'smartphone' => 16
                ),
                'line_height'   => array(
                    'desktop' => 26,
                    'tablet' => 26,
                    'smartphone' => 16,
                ),
                'letter_spacing'   => array(
                    'desktop' => 0,
                    'tablet' => 0,
                    'smartphone' => 0
                ),
                'text_transform'    => 'capitalize',
                'text_decoration'    => 'none',
            ),
            'top_header_option' => true,
            'top_header_responsive_option' => true,
            'top_header_date_time_option'   => true,
            'top_header_menu_option' => true,
            'top_header_ticker_news_post_filter' => 'category',
            'top_header_ticker_news_categories' => '[]',
            'top_header_ticker_news_posts' => '[]',
            'top_header_ticker_news_date_filter' => 'all',
            'custom_button_make_absolute'   =>  true,
            'header_custom_button_label' => array( "icon"  => "fas fa-record-vinyl", "text"   => esc_html__( 'Live Now', 'newsmatic' ) ),
            'header_custom_button_redirect_href_link'  => '',
            'header_custom_button_color_group' => array( 'color'   => "#ffffff", 'hover'   => "#ffffff" ),
            'header_custom_button_background_color_group' => json_encode(array(
                'type'  => 'gradient',
                'solid' => '#b2071d',
                'gradient'  => 'linear-gradient(135deg,rgb(178,7,29) 0%,rgb(1,1,1) 100%)'
            )),
            'header_custom_button_background_hover_color_group' => json_encode(array(
                'type'  => 'solid',
                'solid' => '#b2071d',
                'gradient'  => null
            )),
            'header_newsletter_option'   => true,
            'header_newsletter_label' => array( "icon"  => "far fa-envelope", "text"   => esc_html__( 'Newsletter', 'newsmatic' ) ),
            'header_newsletter_redirect_href_link'  => '',
            'header_random_news_option'   => true,
            'header_random_news_label' => array( "icon"  => "fas fa-bolt", "text"   => esc_html__( 'Random News', 'newsmatic' ) ),
            'header_random_news_filter'    => 'random',
            'header_ads_banner_responsive_option'  => array(
                'desktop'   => true,
                'tablet'   => true,
                'mobile'   => true
            ),
            'header_ads_banner_custom_image'  => '',
            'header_ads_banner_custom_url'  => '',
            'header_ads_banner_custom_target'  => '_self',
            'main_header_elements_order'    => 'social-logo-buttons',
            'top_header_social_option'  => true,
            'header_sidebar_toggle_option'  => true,
            'header_search_option'  => true,
            'header_theme_mode_toggle_option'  => true,
            'theme_header_sticky'  => true,
            'theme_header_custom_button_option'  => false,
            'header_vertical_padding'   => array(
                'desktop' => 35,
                'tablet' => 30,
                'smartphone' => 30
            ),
            'header_sidebar_toggle_color' => array( 'color' => '#525252', 'hover' => '#1B8415' ),
            'header_search_icon_color' => array( 'color' => '#525252', 'hover' => '#1B8415' ),
            'header_menu_hover_effect'  => 'none',
            'header_menu_color'    => array( 'color' => null, 'hover' => null ),
            'theme_header_live_search_option'   => true,
            'social_icons_target' => '_blank',
            'social_icons' => json_encode(array(
                array(
                    'icon_class'    => 'fab fa-facebook-f',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ),
                array(
                    'icon_class'    => 'fab fa-instagram',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ),
                array(
                    'icon_class'    => 'fab fa-x-twitter',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ),
                array(
                    'icon_class'    => 'fab fa-google-wallet',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ),
                array(
                    'icon_class'    => 'fab fa-youtube',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                )
            )),
            'ticker_news_visible'   => 'all',
            'ticker_news_post_filter' => 'category',
            'ticker_news_categories' => '[]',
            'ticker_news_posts' => '[]',
            'ticker_news_date_filter' => 'all',
            'ticker_news_image_size'    => 'thumbnail',
            'ticker_news_title' => array( "icon"  => "fas fa-bolt", "text"   => esc_html__( 'Headlines', 'newsmatic' ) ),
            'main_banner_option'    => true,
            'main_banner_layout'    => 'four',
            'main_banner_slider_order_by'   => 'date-desc',
            'main_banner_post_filter' => 'category',
            'main_banner_slider_categories' => '[]',
            'main_banner_posts' => '[]',
            'main_banner_date_filter' => 'all',
            'main_banner_block_posts_order_by'  => 'rand-desc',
            'main_banner_block_posts_categories'   => '[]',
            'main_banner_five_trailing_posts_order_by'  => 'rand-desc',
            'main_banner_five_trailing_post_filter'  => 'category',
            'main_banner_five_trailing_posts_categories'   => '[]',
            'main_banner_five_trailing_posts'   => '[]',
            'main_banner_five_trailing_posts_layout'   => 'row',
            'main_banner_five_trailing_posts_image_size'    => 'medium_large',
            'banner_section_order'  => array( 
                array( 'value'  => 'banner_slider', 'option'   => true ),
                array( 'value'  => 'tab_slider', 'option'    => true )
            ),
            'banner_slider_image_size'  => 'large',
            'banner_slider_image_border_radius'  => array(
                'desktop'   => 0,
                'tablet'    => 0,
                'smartphone'    => 0
            ),
            'banner_slider_block_posts_image_size'  => 'medium_large',
            'banner_slider_block_posts_image_border_radius'  => array(
                'desktop'   => 0,
                'tablet'    => 0,
                'smartphone'    => 0
            ),
            'full_width_blocks'   => json_encode(array(
                array(
                    'type'  => 'news-grid',
                    'option'    => true,
                    'blockId'   => '',
                    'imageSize' => 'medium_large',
                    'column'    => 'three',
                    'layout'    => 'four',
                    'title'     => esc_html__( 'Latest posts', 'newsmatic' ),
                    'thumbOption'    => true,
                    'categoryOption'    => true,
                    'authorOption'  => true,
                    'dateOption'    => true,
                    'commentOption' => true,
                    'excerptOption' => true,
                    'excerptLength' => 10,
                    'query' => array(
                        'order' => 'date-desc',
                        'count' => 3,
                        'postFilter' => 'category',
                        'dateFilter' => 'all',
                        'posts' => [],
                        'categories' => [],
                        'ids' => []
                    ),
                    'buttonOption' => false,
                    'viewallOption'=> false,
                    'viewallUrl'   => ''
                ),
                array(
                    'type'  => 'ad-block',
                    'option'    => false,
                    'title'     => esc_html__( 'Advertisement Banner', 'newsmatic' ),
                    'media' => ['media_url' => '','media_id'=> 0],
                    'url'   =>  '',
                    'targetAttr'    => '_blank',
                    'relAttr'   => 'nofollow'
                )
            )),
            'leftc_rights_blocks'   => json_encode(array(
                array(
                    'type'  => 'news-filter',
                    'option'    => true,
                    'blockId'   => '',
                    'imageSize' => 'medium_large',
                    'layout'    => 'four',
                    'title'     => esc_html__( 'Latest posts', 'newsmatic' ),
                    'categoryOption'    => true,
                    'authorOption'  => true,
                    'dateOption'    => true,
                    'commentOption' => true,
                    'query' => array(
                        'order' => 'date-desc',
                        'count' => 6,
                        'postFilter' => 'category',
                        'dateFilter' => 'all',
                        'posts' => [],
                        'categories' => [],
                        'ids' => []
                    ),
                    'buttonOption'    => false,
                    'viewallOption'    => false,
                    'viewallUrl'   => ''
                )
            )),
            'lefts_rightc_blocks'   => json_encode(array(
                array(
                    'type'  => 'news-list',
                    'option'    => true,
                    'blockId'   => '',
                    'imageSize' => 'medium_large',
                    'layout'    => 'two',
                    'column'    => 'two',
                    'title'     => esc_html__( 'Latest posts', 'newsmatic' ),
                    'thumbOption'    => true,
                    'categoryOption'    => true,
                    'authorOption'  => true,
                    'dateOption'    => true,
                    'commentOption' => true,
                    'excerptOption' => true,
                    'excerptLength' => 10,
                    'query' => array(
                        'order' => 'date-desc',
                        'count' => 4,
                        'postFilter' => 'category',
                        'dateFilter' => 'all',
                        'posts' => [],
                        'categories' => [],
                        'ids' => []
                    ),
                    'buttonOption'    => false,
                    'viewallOption'    => false,
                    'viewallUrl'   => ''
                )
            )),
            'bottom_full_width_blocks'   => json_encode(array(
                array(
                    'type'  => 'news-carousel',
                    'option'    => true,
                    'blockId'   => '',
                    'imageSize' => 'medium_large',
                    'layout'    => 'three',
                    'title'     => esc_html__( 'You May Have Missed', 'newsmatic' ),
                    'categoryOption'    => true,
                    'authorOption'  => true,
                    'dateOption'    => true,
                    'commentOption' => false,
                    'excerptOption' => false,
                    'excerptLength' => 10,
                    'columns' => 4,
                    'query' => array(
                        'order' => 'rand-desc',
                        'count' => 8,
                        'postFilter' => 'category',
                        'dateFilter' => 'all',
                        'posts' => [],
                        'categories' => [],
                        'ids' => []
                    ),
                    'buttonOption'    => false,
                    'viewallOption'    => false,
                    'viewallUrl'   => '',
                    'dots' => true,
                    'loop' => false,
                    'arrows' => true,
                    'auto' => false
                )
            )),
            'opinons_section_option'    => false,
            'opinons_section_show_on'   => 'all',
            'bottom_footer_site_info'   => esc_html__( 'Newsmatic - News WordPress Theme %year%.', 'newsmatic' ),
            'single_post_element_order'    => array(
                array( 'value'  => 'categories', 'option' => true ),
                array( 'value'  => 'title', 'option' => true ),
                array( 'value'  => 'meta', 'option' => true ),
                array( 'value'  => 'thumbnail', 'option' => true )
            ),
            'single_post_meta_order'    => array(
                array( 'value'  => 'author', 'option' => true ),
                array( 'value'  => 'date', 'option' => true ),
                array( 'value'  => 'comments', 'option' => true ),
                array( 'value'  => 'read-time', 'option' => true )
            ),
            'single_post_related_posts_option'  => true,
            'single_post_related_posts_title'   => esc_html__( 'Related News', 'newsmatic' ),
            'archive_page_layout'   => 'one',
            'archive_page_title_prefix'   => false,
            'archive_post_element_order'    => array(
                array( 'value'  => 'title', 'option' => true ),
                array( 'value'  => 'meta', 'option' => true ),
                array( 'value'  => 'excerpt', 'option' => true ),
                array( 'value'  => 'button', 'option' => true )
            ),
            'archive_post_meta_order'    => array(
                array( 'value'  => 'author', 'option' => true ),
                array( 'value'  => 'date', 'option' => true ),
                array( 'value'  => 'comments', 'option' => true ),
                array( 'value'  => 'read-time', 'option' => true )
            ),
            'archive_page_image_size'   => 'newsmatic-list',
            'archive_page_image_ratio'   => array(
                'desktop'   => 0.25,
                'tablet'    => 0.4,
                'smartphone'=> 0.4
            ),
            'archive_page_image_border_radius'   => array(
                'desktop'   => 0,
                'tablet'    => 0,
                'smartphone'=> 0
            ),
            'error_page_image'  => 0,
            'stt_responsive_option'    => array(
                'desktop'   => true,
                'tablet'   => true,
                'mobile'   => false
            ),
            'stt_text'  => array( "icon"  => "fas fa-angle-up", "text"   => '' ),
            'stt_alignment' => 'right',
            'stt_color_group' => array( 'color'   => "#fff", 'hover'   => "#fff" ),
            'stt_background_color_group' => array( 'color'   => "#1B8415", 'hover'   => "#1B8415" ),
            'newsmatic_disable_admin_notices'   => false,

            // Mark: Header builder
            'header_builder'    =>  newsmatic_get_header_builder_default(),
            'header_width_layout'   => 'contain',
            'theme_header_sticky'  => true,
            'header_first_row_header_sticky'  => false,
            'header_second_row_header_sticky'  => false,
            'header_third_row_header_sticky'  => true,
            'header_builder_border'  => [ "type"  => "none", "width"   => "1", "color"   => "#eee" ],
            'header_builder_box_shadow'  => [
                'option'    => 'adjust',
                'hoffset'   => 0,
                'voffset'   => 2,
                'blur'  => 4,
                'spread'    => 0,
                'type'  => 'outset',
                'color' => 'rgb(0 0 0 / 8%)'
            ],
            // MARK: Header 1st row
            'header_first_row_column'   =>  $is_header_layout_two ? 3 : 2,
            'header_first_row_column_layout'    =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'four', 'eight', 'eight' ) : newsmatic_get_responsive_defaults( 'one', 'three', 'three' ),
            'header_first_row_full_width'   =>  true,
            'top_header_background_color_group' => json_encode([
                'type'  => 'solid',
                'solid' => '#1b8415',
                'gradient'  => null
            ]),
            'header_first_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ]
            ],
            'top_header_bottom_border'    => [ "type"  => "none", "width"   => "1", "color"   => "#E8E8E8" ],
            'header_first_row_column_one'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'left', 'center', 'center' ) : newsmatic_get_responsive_defaults( 'left', 'center', 'center' ),
            'header_first_row_column_two'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'center', 'center', 'center' ) : newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            'header_first_row_column_three' =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'right', 'center', 'center' ) : newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            // MARK: Header 2nd row
            'header_second_row_column'   =>  $is_header_layout_two ? 2 : 3,
            'header_second_row_column_layout'    =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'three', 'four', 'four' ) : newsmatic_get_responsive_defaults( 'two', 'five', 'five' ),
            'header_second_row_full_width'   =>  true,
            'header_background_color_group' => json_encode([
                'type'  => 'solid',
                'solid' => '#fff',
                'gradient'  => null,
                'image'     => [ 'media_id' => 0, 'media_url' => '' ]
            ]),
            'header_menu_top_border'    => array( "type"  => "solid", "width"   => "1", "color"   => "#1B8415" ),
            'header_second_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  newsmatic_get_padding_value( 'desktop' ) . 'px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  newsmatic_get_padding_value( 'tablet' ) . 'px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  newsmatic_get_padding_value( 'smartphone' ) . 'px', 'left'  =>  '0px' ]
            ],
            'header_second_row_column_one'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'left', 'left', 'center' ) : newsmatic_get_responsive_defaults( 'left', 'center', 'center' ),
            'header_second_row_column_two'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'right', 'right', 'center' ) : newsmatic_get_responsive_defaults( 'center', 'center', 'center' ),
            'header_second_row_column_three' =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'right', 'right', 'right' ) : newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            // MARK: Header 3rd row
            'header_third_row_column'   =>  $is_header_layout_two ? 2 : 3,
            'header_third_row_column_layout'    =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'two', 'four', 'four' ) : newsmatic_get_responsive_defaults( 'three', 'four', 'four' ),
            'header_third_row_full_width'   =>  true,
            'header_menu_background_color_group' => json_encode(array(
                'type'  => 'solid',
                'solid' => '#fff',
                'gradient'  => null
            )),
            'header_third_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '0px', 'right'  =>  '0px', 'bottom' =>  '0px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ]
            ],
            'header_third_row_column_one'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'left', 'left', 'center' ) : newsmatic_get_responsive_defaults( 'left', 'left', 'left' ),
            'header_third_row_column_two'   =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'right', 'right', 'center' ) : newsmatic_get_responsive_defaults( 'center', 'right', 'right' ),
            'header_third_row_column_three' =>  $is_header_layout_two ? newsmatic_get_responsive_defaults( 'right', 'right', 'right' ) : newsmatic_get_responsive_defaults( 'right', 'right', 'right' ),
            // Mark: Responsive Builder
            'responsive_header_builder' =>  newsmatic_get_header_builder_default( true ),
            // MARK: Dark Mode
            'theme_default_mode'    =>  'light',
            'light_mode_color'  =>  [ 'color' => '#000', 'hover' => '#1B8415' ],
            'dark_mode_color'   =>  [ 'color' => '#1B8415', 'hover' => '#1B8415' ],
            // MARK: Mobile Canvas
            'mobile_canvas_alignment'   =>  'left',
            'mobile_canvas_icon_color'  =>  array( 'color' => '#000', 'hover' => '#1B8415' ),
            'mobile_canvas_text_color'  =>  array( 'color' => '#000', 'hover' => '#1B8415' ),
            'mobile_canvas_background'  =>  '#fff',
            // MARK: Footer Builder
            'footer_builder'    =>  newsmatic_get_footer_builder_default(),
            'footer_section_width'  => 'boxed-width',
            // MARK: Footer 1st row
            'footer_first_row_column'   =>  newsmatic_get_footer_first_row_column(),
            'footer_first_row_column_layout'    =>  newsmatic_get_responsive_defaults( 'one', 'three', 'three' ),
            'footer_first_row_full_width'   =>  true,
            'footer_color'  => [ 'color'   => '#fff', 'hover'   => "#fff" ],
            'footer_background_color_group' => json_encode([
                'type'  => 'solid',
                'solid' => '#000',
                'gradient'  => null,
                'image'     => [ 'media_id' => 0, 'media_url' => '' ]
            ]),
            'footer_top_border'    => [ "type"  => "solid", "width"   => "5", "color"   => "#1B8415" ],
            'footer_first_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  '35px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  '35px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '35px', 'right'  =>  '0px', 'bottom' =>  '35px', 'left'  =>  '0px' ]
            ],
            'footer_first_row_column_one'   =>  newsmatic_get_responsive_defaults( 'left', 'center', 'center' ),
            'footer_first_row_column_two'   =>  newsmatic_get_responsive_defaults( 'center', 'center', 'center' ),
            'footer_first_row_column_three' =>  newsmatic_get_responsive_defaults( 'center', 'center', 'center' ),
            'footer_first_row_column_four'  =>  newsmatic_get_responsive_defaults( 'right', 'right', 'right' ),
            // MARK: Footer 2nd row
            'footer_second_row_column'   =>  1,
            'footer_second_row_column_layout'    =>  newsmatic_get_responsive_defaults( 'one', 'four', 'four' ),
            'footer_second_row_full_width'   =>  true,
            'footer_second_row_background' => json_encode([
                'type'  => 'solid',
                'solid' => '#1b8415',
                'gradient'  => null
            ]),
            'footer_second_row_border'    => [ "type"  => "none", "width"   => "1", "color"   => "#E8E8E8" ],
            'footer_second_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '10px', 'right'  =>  '0px', 'bottom' =>  '10px', 'left'  =>  '0px' ]
            ],
            'footer_second_row_column_one'   =>  newsmatic_get_responsive_defaults( 'center', 'center', 'center' ),
            'footer_second_row_column_two'   =>  newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            'footer_second_row_column_three' =>  newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            'footer_second_row_column_four'  =>  newsmatic_get_responsive_defaults( 'right', 'right', 'right' ),
            // MARK: Footer 3rd row
            'footer_third_row_column'   =>  $footer_menu ? 2 : 1,
            'footer_third_row_column_layout'    =>  newsmatic_get_responsive_defaults( 'one', 'four', 'four' ),
            'footer_third_row_full_width'   =>  true,
            'footer_third_row_background' => json_encode([
                'type'  => 'solid',
                'solid' => '#000',
                'gradient'  => null
            ]),
            'footer_third_row_border'    => [ "type"  => "none", "width"   => "1", "color"   => "#E8E8E8" ],
            'footer_third_row_padding'  =>  [
                'desktop'   =>  [ 'top' => '20px', 'right'  =>  '0px', 'bottom' =>  '20px', 'left'  =>  '0px' ], 
                'tablet'    =>  [ 'top' => '20px', 'right'  =>  '0px', 'bottom' =>  '20px', 'left'  =>  '0px' ], 
                'smartphone'    =>  [ 'top' => '20px', 'right'  =>  '0px', 'bottom' =>  '20px', 'left'  =>  '0px' ]
            ],
            'footer_third_row_column_one'   =>  $footer_menu ? newsmatic_get_responsive_defaults( 'left', 'center', 'center' ) : newsmatic_get_responsive_defaults( 'center', 'center', 'center' ),
            'footer_third_row_column_two'   =>  newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            'footer_third_row_column_three' =>  newsmatic_get_responsive_defaults( 'right', 'center', 'center' ),
            'footer_third_row_column_four'  =>  newsmatic_get_responsive_defaults( 'right', 'right', 'right' ),
            // MARK: Footer logo
            'bottom_footer_logo_option' =>  0,
            'bottom_footer_header_or_custom'    =>  'header',
            'bottom_footer_logo_width'  =>  newsmatic_get_responsive_defaults( 200, 200, 200 ),
            // MARK: Footer Social icons
            'footer_social_icons_target'    =>  '_blank',
            'footer_social_icons'   =>  json_encode([
                [
                    'icon_class'    => 'fab fa-facebook-f',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ],
                [
                    'icon_class'    => 'fab fa-instagram',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ],
                [
                    'icon_class'    => 'fab fa-x-twitter',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ],
                [
                    'icon_class'    => 'fab fa-google-wallet',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ],
                [
                    'icon_class'    => 'fab fa-youtube',
                    'icon_url'      => '',
                    'item_option'   => 'show'
                ]
            ]),
            'footer_social_icons_color' =>  [ 'color' => null, 'hover' => null ],
            // MARK: Footer menu
            'footer_menu_hover_effect'  =>  'none',
            // MARK: Date Time
            'date_option'   =>  true,
            'time_option'   =>  true,
            'date_time_display_block'   =>  false,
            'top_header_datetime_color' => '#fff',
            // MARK: Off Canvas
            'off_canvas_position'   =>  'left',
            // Secondary Menu
            'secondary_menu_hover_effect' => 'none',
            'top_header_menu_color' => array( 'color' => null, 'hover' => null ),
            'header_menu_bottom_border'    => array( "type"  => "none", "width"   => "1", "color"   => "#eee" ),
            'header_random_news_label_color' => array( 'color' => '#525252', 'hover' => '#1B8415' ),
            'header_newsletter_label_color' => array( 'color' => '#525252', 'hover' => '#1B8415' ),
            'bottom_footer_background_color_group'  => json_encode(array(
                'type'  => 'solid',
                'solid' => '#000',
                'gradient'  => null
            )),
            'bottom_footer_text_color'  => '#8a8a8a',
            'top_header_social_icon_color' => array( 'color' => null, 'hover' => null ),
            'use_ad_outside_of_header'  =>  true
        ));
        $totalCats = get_categories();
        if( $totalCats ) :
            foreach( $totalCats as $singleCat ) :
                $array_defaults['category_' .absint($singleCat->term_id). '_color'] = newsmatic_get_rcolor_code();
            endforeach;
        endif;
        if( $key == 'archive_page_image_ratio' ) {
            $archive_page_layout = newsmatic_get_customizer_option( 'archive_page_layout' );
            if( $archive_page_layout == 'two' ) {
                return array(
                    'desktop'   => 0.6,
                    'tablet'    => 0.6,
                    'smartphone'=> 0.6
                );
            }
        }
        return $array_defaults[$key];
    }
 endif;
 
 if( ! function_exists( 'newsmatic_get_responsive_defaults' ) ) :
    /**
     * Get default responsive values
     * 
     * @since 1.0.0
     */
    function newsmatic_get_responsive_defaults( $desktop = 0, $tablet = 0, $smartphone = 0 ){
        $value = [
            'desktop'   => $desktop,
            'tablet'    => $tablet,
            'smartphone' => $smartphone
        ];
        return $value;
    }
endif;

if( ! function_exists( 'newsmatic_get_header_builder_default' ) ) :
    /**
     * Get header builder default
     * 
     * @since 1.4.0
     */
    function newsmatic_get_header_builder_default( $is_responsive = false ) {
        $header_layout = get_theme_mod( 'header_layout', 'one' );
        $top_header_option = newsmatic_has_theme_mod( 'top_header_option', true );
        $date_time = newsmatic_has_theme_mod( 'top_header_date_time_option', true );
        $ticker_news = newsmatic_has_theme_mod( 'top_header_ticker_news_option', true );
        $secondary_menu = newsmatic_has_theme_mod( 'top_header_menu_option', true );
        $top_header_right_content_type = get_theme_mod( 'top_header_right_content_type', 'ticker-news' );
        $social_icons = newsmatic_has_theme_mod( 'top_header_social_option', true );
        $newsletter = newsmatic_has_theme_mod( 'header_newsletter_option', true );
        $random_news = newsmatic_has_theme_mod( 'header_random_news_option', true );
        $off_canvas = get_theme_mod( 'header_sidebar_toggle_option', false );
        $search = newsmatic_has_theme_mod( 'header_search_option', true );
        $theme_mode = newsmatic_has_theme_mod( 'header_theme_mode_toggle_option', true );
        $custom_button = get_theme_mod( 'theme_header_custom_button_option', false );
        $main_header_elements_order = get_theme_mod( 'main_header_elements_order', 'social-logo-buttons' );
        $header_ads_banner_responsive_option = get_theme_mod( 'header_ads_banner_responsive_option', [
            'desktop'   => true,
            'tablet'   => true,
            'mobile'   => true
        ]);
        extract( $header_ads_banner_responsive_option );

        $layout_two_21_value = $layout_one_12_value = $layout_one_22_value = $ticker_news_or_secondary_menu = $layout_one_10_value = $layout_two_11_value = [];
        if( $top_header_option ) {
            if( $top_header_right_content_type === 'nav-menu' ) {
                if( $secondary_menu ) $ticker_news_or_secondary_menu[] = 'secondary-menu';
            } else {
                if( $ticker_news ) $ticker_news_or_secondary_menu[] = 'ticker-news';
            }
        }

        if( $header_layout == 'one' ) :
            if( $search ) $layout_one_22_value[] = 'search';
            if( $theme_mode ) $layout_one_22_value[] = 'theme-mode';
            if( $main_header_elements_order === 'social-logo-buttons' ) {
                if( $social_icons ) $layout_one_10_value[] = 'social-icons';
                if( $newsletter ) $layout_one_12_value[] = 'newsletter';
                if( $random_news ) $layout_one_12_value[] = 'random-news';
                if( $custom_button ) $layout_one_12_value[] = 'button';
            } else {
                if( $social_icons ) $layout_one_12_value[] = 'social-icons';
                if( $newsletter ) $layout_one_10_value[] = 'newsletter';
                if( $random_news ) $layout_one_10_value[] = 'random-news';
                if( $custom_button ) $layout_one_10_value[] = 'button';
            }

            if( $is_responsive ) :
                if( $tablet || $mobile ) $layout_one_22_value[] = 'image';
                $builder_value = [
                    '00'    =>  $ticker_news_or_secondary_menu,
                    '01'    =>  [],
                    '02'    =>  [],
                    '03'    =>  [],
                    '10'    =>  $layout_one_10_value,
                    '11'    =>  [ 'site-logo' ],
                    '12'    =>  $layout_one_12_value,
                    '13'    =>  [],
                    '20'    =>  [ 'toggle-button' ],
                    '21'    =>  $layout_one_22_value,
                    '22'    =>  [],
                    '23'    =>  [],
                    'responsive-canvas' =>  [ 'menu' ]
                ];
            else:
                if( $desktop ) $layout_one_10_value[] = 'image';
                $builder_value = [
                    '00'    =>  ( $top_header_option && $date_time ) ? [ 'date-time' ] : [],
                    '01'    =>  $ticker_news_or_secondary_menu,
                    '02'    =>  [],
                    '03'    =>  [],
                    '10'    =>  $layout_one_10_value,
                    '11'    =>  [ 'site-logo' ],
                    '12'    =>  $layout_one_12_value,
                    '13'    =>  [],
                    '20'    =>  $off_canvas ? [ 'off-canvas' ] : [],
                    '21'    =>  [ 'menu' ],
                    '22'    =>  $layout_one_22_value,
                    '23'    =>  []
                ];
            endif;
        else:
            if( $newsletter ) $layout_two_21_value[] = 'newsletter';
            if( $random_news ) $layout_two_21_value[] = 'random-news';
            if( $search ) $layout_two_21_value[] = 'search';
            if( $theme_mode ) $layout_two_21_value[] = 'theme-mode';
            if( $custom_button ) $layout_two_11_value[] = 'button';
    
            if( $is_responsive ) :
                $responsive_layout_two_11_value = [];
                if( $tablet || $mobile ) $responsive_layout_two_11_value[] = 'image';
                $builder_value = [
                    '00'    =>  $ticker_news_or_secondary_menu,
                    '01'    =>  ( $top_header_option && $social_icons ) ? [ 'social-icons' ] : [],
                    '02'    =>  [],
                    '03'    =>  [],
                    '10'    =>  [ 'site-logo' ],
                    '11'    =>  $responsive_layout_two_11_value,
                    '12'    =>  [],
                    '13'    =>  [],
                    '20'    =>  [ 'toggle-button' ],
                    '21'    =>  $layout_two_21_value,
                    '22'    =>  [],
                    '23'    =>  [],
                    'responsive-canvas' =>  [ 'menu' ]
                ];
            else:
                if( $desktop ) $layout_two_11_value[] = 'image';
                $builder_value = [
                    '00'    =>  ( $top_header_option && $date_time ) ? [ 'date-time' ] : [],
                    '01'    =>  $ticker_news_or_secondary_menu,
                    '02'    =>  ( $top_header_option && $social_icons ) ? [ 'social-icons' ] : [],
                    '03'    =>  [],
                    '10'    =>  [ 'site-logo' ],
                    '11'    =>  $layout_two_11_value,
                    '12'    =>  [],
                    '13'    =>  [],
                    '20'    =>  $off_canvas ? [ 'off-canvas', 'menu' ] : [ 'menu' ],
                    '21'    =>  $layout_two_21_value,
                    '22'    =>  [],
                    '23'    =>  []
                ];
            endif;
        endif;

        return $builder_value;
    }
endif;

if( ! function_exists( 'newsmatic_get_footer_builder_default' ) ) :
    /**
     * Get footer builder default
     * 
     * @since 1.4.0
     */
    function newsmatic_get_footer_builder_default() {
        $header_layout = get_theme_mod( 'header_layout', 'one' );
        $footer_option = get_theme_mod( 'footer_option', false );
        $bottom_footer_option = get_theme_mod( 'bottom_footer_option', true );
        $social_icons = get_theme_mod( 'bottom_footer_social_option', false );
        $footer_widget_column = get_theme_mod( 'footer_widget_column', 'column-three' );
        $copyright = get_theme_mod( 'bottom_footer_site_info', esc_html__( 'Newsmatic - News WordPress Theme %year%.', 'newsmatic' ) );
        $footer_menu = get_theme_mod( 'bottom_footer_menu_option', false );
        $stt_responsive_option = get_theme_mod( 'stt_responsive_option', [ 'desktop' => true, 'tablet' => true, 'mobile' => false ]);
        extract( $stt_responsive_option );
        $stt = ( $desktop || $tablet || $mobile ) ? true : false;
        
        $column_10_value = $column_20_value = [];
        if( $stt ) $column_20_value[] = 'scroll-to-top';
        if( $bottom_footer_option && $copyright ) $column_20_value[] = 'copyright';
        if( $bottom_footer_option && $social_icons ) $column_10_value[] = 'social-icons';

        $builder_value = [
            '00'    =>  ( $footer_option && in_array( $footer_widget_column, [ 'column-one', 'column-two', 'column-three', 'column-four' ] ) ) ? [ 'sidebar-one' ] : [],
            '01'    =>  ( $footer_option && in_array( $footer_widget_column, [ 'column-two', 'column-three', 'column-four' ] ) ) ? [ 'sidebar-two' ] : [],
            '02'    =>  ( $footer_option && in_array( $footer_widget_column, [ 'column-three', 'column-four' ] ) ) ? [ 'sidebar-three' ] : [],
            '03'    =>  ( $footer_option && in_array( $footer_widget_column, [ 'column-four' ] ) ) ? [ 'sidebar-four' ] : [],
            '10'    =>  $column_10_value,
            '11'    =>  [],
            '12'    =>  [],
            '13'    =>  [],
            '20'    =>  $column_20_value,
            '21'    =>  ( $bottom_footer_option && $footer_menu ) ? [ 'menu' ] : [],
            '22'    =>  [],
            '23'    =>  [],
        ];

        return $builder_value;
    }
endif;

if( ! function_exists( 'newsmatic_get_padding_value' ) ) :
    /**
     * Get padding value for header second row
     * 
     * @since 1.4.0
     */
    function newsmatic_get_padding_value( $device = '' ) {
        $header_layout = get_theme_mod( 'header_layout', 'one' );
        $header_vertical_padding = get_theme_mod( 'header_vertical_padding', [ 'desktop' => 35, 'tablet' => 30, 'smartphone' => 30 ] );
        $device_value = ( ( $header_layout === 'two' ) ? ( $header_vertical_padding[ $device ] + 25 ) : $header_vertical_padding[ $device ] );
        return $device ? $device_value : $header_vertical_padding;
    }
endif;

if( ! function_exists( 'newsmatic_get_footer_first_row_column' ) ) :
    /**
     * Get padding value for header second row
     * 
     * @since 1.4.0
     */
    function newsmatic_get_footer_first_row_column() {
        $footer_widget_column = get_theme_mod( 'footer_widget_column', 'column-three' );
        switch( $footer_widget_column ) :
            case 'column-one' :
                return 1;
                break;
            case 'column-two' :
                return 2;
                break;
            case 'column-three' :
                return 3;
                break;
            case 'column-four' :
                return 4;
                break;
        endswitch;
    }
endif;