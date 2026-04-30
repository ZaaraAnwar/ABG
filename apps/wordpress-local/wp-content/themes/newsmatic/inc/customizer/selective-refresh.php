<?php
/**
 * Includes functions for selective refresh
 * 
 * @package Newsmatic
 * @since 1.0.0
 */
use Newsmatic\CustomizerDefault as ND;
if( ! function_exists( 'newsmatic_customize_selective_refresh' ) ) :
    /**
     * Adds partial refresh for the customizer preview
     * 
     */
    function newsmatic_customize_selective_refresh( $wp_customize ) {
        if ( ! isset( $wp_customize->selective_refresh ) ) return;
        // site title
        $wp_customize->selective_refresh->add_partial(
            'blogname',
            array(
                'selector'        => '.site-title a',
                'render_callback' => 'newsmatic_customize_partial_blogname',
            )
        );
        // site description
        $wp_customize->selective_refresh->add_partial(
            'blogdescription',
            array(
                'selector'        => '.site-description',
                'render_callback' => 'newsmatic_customize_partial_blogdescription',
            )
        );
        
        // social icons target attribute
        $wp_customize->selective_refresh->add_partial(
            'social_icons_target',
            array(
                'selector'        => '.top-header .social-icons-wrap',
                'render_callback' => 'newsmatic_customizer_social_icons',
            )
        );

        // social icons
        $wp_customize->selective_refresh->add_partial(
            'social_icons',
            array(
                'selector'        => '.top-header .social-icons-wrap',
                'render_callback' => 'newsmatic_customizer_social_icons',
            )
        );

        // post read more button label
        $wp_customize->selective_refresh->add_partial(
            'global_button_text',
            array(
                'selector'        => 'article .post-link-button',
                'render_callback' => 'newsmatic_customizer_read_more_button',
            )
        );

        // scroll to top label
        $wp_customize->selective_refresh->add_partial(
            'stt_text',
            array(
                'selector'        => '#newsmatic-scroll-to-top',
                'render_callback' => 'newsmatic_customizer_stt_button',
            )
        );

        // ticker news title
        $wp_customize->selective_refresh->add_partial(
            'ticker_news_title',
            array(
                'selector'        => '.ticker-news-wrap .ticker_label_title',
                'render_callback' => 'newsmatic_customizer_ticker_label',
            )
        );

        // newsletter label
        $wp_customize->selective_refresh->add_partial(
            'header_newsletter_label',
            array(
                'selector'        => '.newsletter-element a',
                'render_callback' => 'newsmatic_customizer_newsletter_button_label',
            )
        );

        // random news label
        $wp_customize->selective_refresh->add_partial(
            'header_random_news_label',
            array(
                'selector'        => '.random-news-element a',
                'render_callback' => 'newsmatic_customizer_random_news_button_label',
            )
        );

        // single post related posts option
        $wp_customize->selective_refresh->add_partial(
            'single_post_related_posts_option',
            array(
                'selector'        => '.single-related-posts-section-wrap',
                'render_callback' => 'newsmatic_single_related_posts',
            )
        );

        // custom button label
        $wp_customize->selective_refresh->add_partial( 'header_custom_button_label', [
            'selector'        => '.header-custom-button',
            'render_callback' => 'newsmatic_customizer_custom_button_label',
            'settings'  =>  [ 'header_custom_button_label', 'header_custom_button_redirect_href_link' ]
        ]);

        // Header Builder Edit button
        $wp_customize->selective_refresh->add_partial( 'header_builder_section_tab', [
            'selector'        => 'header.site-header'
        ]);

        // Footer Builder Edit button
        $wp_customize->selective_refresh->add_partial( 'footer_builder_section_tab', [
            'selector'        => 'footer.site-footer'
        ]);
    }
    add_action( 'customize_register', 'newsmatic_customize_selective_refresh' );
endif;

/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function newsmatic_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function newsmatic_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

// global button label
function newsmatic_customizer_read_more_button() {
    $global_button_text = ND\newsmatic_get_customizer_option( 'global_button_text' );
    return ( esc_html( $global_button_text['text'] ) . '<i class="' .esc_attr( $global_button_text['icon'] ). '"></i>' );
}

// scroll to top button label
function newsmatic_customizer_stt_button() {
    $stt_text = ND\newsmatic_get_customizer_option( 'stt_text' );
    if( $stt_text['icon'] == 'fas fa-ban' ) return( '<span class="icon-text">' .esc_html( $stt_text['text'] ). '</span>' );
    return( '<span class="icon-holder"><i class="' .esc_attr( $stt_text['icon'] ). '"></i></span><span class="icon-text">' .esc_html( $stt_text['text'] ). '</span>' );
}

// ticker label latest tab
function newsmatic_customizer_ticker_label() {
    $ticker_news_title = ND\newsmatic_get_customizer_option( 'ticker_news_title' );
    return ( '<span class="icon"><i class="' .esc_attr( $ticker_news_title['icon'] ). '"></i></span><span class="ticker_label_title_string">' .esc_html( $ticker_news_title['text'] ). '</span>' );
}

// newsletter button label
function newsmatic_customizer_newsletter_button_label() {
    $header_newsletter_label = ND\newsmatic_get_customizer_option( 'header_newsletter_label' );
    ob_start();
        if( isset($header_newsletter_label['icon']) ) echo '<span class="title-icon"><i class="' .esc_attr($header_newsletter_label['icon']). '"></i></span>';
        if( isset($header_newsletter_label['text']) ) echo '<span class="title-text">' .esc_html($header_newsletter_label['text']). '</span>';
    $content = ob_get_clean();
    return $content;
}

// random news button label
function newsmatic_customizer_random_news_button_label() {
    $header_random_news_label = ND\newsmatic_get_customizer_option( 'header_random_news_label' );
    ob_start();
        if( isset($header_random_news_label['icon']) ) echo '<span class="title-icon"><i class="' .esc_attr($header_random_news_label['icon']). '"></i></span>';
        if( isset($header_random_news_label['text']) ) echo '<span class="title-text">' .esc_html($header_random_news_label['text']). '</span>';
    $content = ob_get_clean();
    return $content;
}

// custom button label
function newsmatic_customizer_custom_button_label() {
    $header_custom_button_redirect_href_link = ND\newsmatic_get_customizer_option( 'header_custom_button_redirect_href_link' );
    $header_custom_button_label = ND\newsmatic_get_customizer_option( 'header_custom_button_label' );
    ?>
        <a class="header-custom-button" href="<?php echo esc_url($header_custom_button_redirect_href_link); ?>" target="_blank">
            <?php if( $header_custom_button_label['icon'] != "fas fa-ban" ) : ?>
                <span class="icon">
                    <i class="<?php echo esc_attr($header_custom_button_label['icon']); ?>"></i>
                </span>
            <?php endif;
            if( $header_custom_button_label['text'] ) :
            ?>
                <span class="ticker_label_title_string"><?php echo esc_html( $header_custom_button_label['text'] ); ?></span>
            <?php endif; ?>
        </a>
    <?php
}