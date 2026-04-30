<?php
/**
 * Bottom Footer hooks and functions
 * 
 * @package Newsmatic
 * @since 1.0.0
 */
use Newsmatic\CustomizerDefault as ND;

if( ! function_exists( 'newsmatic_bottom_footer_inner_wrapper_open' ) ) :
   /**
    * Bottom Footer inner wrapper open
    * 
    * @since 1.0.0
    */
   function newsmatic_bottom_footer_inner_wrapper_open() {
      ?>
         <div class="bottom-inner-wrapper">
      <?php
   }
   add_action( 'newsmatic_botttom_footer_hook', 'newsmatic_bottom_footer_inner_wrapper_open', 15 );
endif;

if( ! function_exists( 'newsmatic_bottom_footer_inner_wrapper_close' ) ) :
   /**
    * Bottom Footer inner wrapper close
    * 
    * @since 1.0.0
    */
   function newsmatic_bottom_footer_inner_wrapper_close() {
      ?>
         </div><!-- .bottom-inner-wrapper -->
      <?php
   }
   add_action( 'newsmatic_botttom_footer_hook', 'newsmatic_bottom_footer_inner_wrapper_close', 40 );
endif;