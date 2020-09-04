<?php
/**
 * Plugin Name: Recent Posts Block
 * Plugin Author: Stephen Dickinson <stephencottontail@me.com>
 * Description: Rolling my own latest posts block mostly to learn stuff
 * Version: 1.0.0
 */

class SC_Recent_Posts extends WP_Block_Type {
	public $name = 'sc/recent-posts';
	public $editor_script = 'sc-recent-posts-editor-script';
	public $render_callback = 'sc_recent_posts_render';
	public $attributes = array(
		'backgroundImage' => array(
			'type' => 'string',
			'default' => ''
		),
		'selectedType' => array(
			'type' => 'string',
			'default' => 'post'
		),
		'postsPerBlock' => array(
			'type' => 'integer',
			'default' => 5
		)
	);

	public function __construct() {
		parent::__construct( $this->name, array(
			'editor_script' => $this->editor_script,
			'render_callback' => array( $this, 'sc_recent_posts_render' )
		) );
	}

	function sc_recent_posts_render( $attributes ) {
		$background_image = $attributes['backgroundImage'];
		$selected_type = $attributes['selectedType'];
		$posts_per_block = $attributes['postsPerBlock'];

		$recent_posts_query = new WP_Query( array(
			'post_type' => $selected_type,
			'posts_per_page' => $posts_per_block,
		) );

		if ( $recent_posts_query->have_posts() ) :
			ob_start(); ?>

			<div class="wp-block-sc-recent-posts">
				<h2 class="wp-block-sc-recent-posts__title">
					<?php
					$suffix = '';

					if ( 0 < $recent_posts_query->found_posts ) {
						$suffix = 's';
					}

					echo esc_html( $selected_type . $suffix );
					?>
				</h2>
				<div class="img-wrapper">
					<div class="overlay"></div>
					<?php printf( '<img src="%s" />', $background_image ); ?>
				</div>
				<div class="wp-block-sc-recent-posts__entries">
				<?php
				while ( $recent_posts_query->have_posts() ) {
					$recent_posts_query->the_post();

					printf( '<article class="wp-block-sc-recent-posts__entry"><a href="%s">%s</a></article>',
						esc_url( get_the_permalink() ),
						str_pad( ( $recent_posts_query->current_post + 1 ), 2, "0", STR_PAD_LEFT ) . '/ ' . esc_html( get_the_title() ),
					);
				}
				?>
				</div><!-- .wp-block-sc-recent-posts__entries -->
			</div><!-- .wp-block-sc-recent-posts -->

		<?php
		endif;

		wp_reset_postdata();
		wp_reset_query();

		return ob_get_clean();
	}
}

add_action( 'init', function() {
	$script_path = 'dist/block.js';
	$script_url = plugins_url( $script_path, __FILE__ );
	$assets = require( 'dist/block.asset.php' );

	wp_register_script( 'sc-recent-posts-editor-script', $script_url, $assets['dependencies'], $assets['version'], true );

	$recent_posts = new SC_Recent_Posts();
	register_block_type( $recent_posts );
} );

add_action( 'init', function() {
	$common_post_type_args = array(
		'public' => true,
		'has_archive' => true,
		'show_in_rest' => true,
		'supports' => array( 'title', 'editor', 'custom-fields', 'thumbnail' ),
	);

	register_post_type( 'theme-posts', array_merge( array(
		'taxonomies' => array( 'category', 'post_tag' ),
		'labels' => array(
			'singular_name' => 'Theme Post',
			'name'          => 'Theme Posts'
		),
		'rewrite' => array(
			'slug' => 'theme-posts'
		),
	), $common_post_type_args ) );

	register_post_type( 'projects', array_merge( array(
		'labels' => array(
			'singular_name' => 'Project',
			'name'          => 'Projects'
		),
		'rewrite' => array(
			'slug' => 'projects'
		),
	), $common_post_type_args ) );
}, 0 );

add_action( 'init', function() {
	$common_post_meta_args = array(
		'show_in_rest' => true,
		'single'       => true,
		'type'         => 'string'
	);

	wp_oembed_add_provider( 'https://codepen.io/*/pen/*', 'https://codepen.io/api/oembed' );

	register_post_meta( 'projects', 'sc_recent_posts_codepen_url', array_merge( array(
		'sanitize_callback' => 'sc_recent_posts_sanitize_url'
	), $common_post_meta_args ) );

	register_post_meta( 'projects', 'sc_recent_posts_technologies', array_merge( array(
		'sanitize_callback' => 'sc_recent_posts_sanitize_text'
	), $common_post_meta_args ) );

	register_post_meta( 'projects', 'sc_recent_posts_inspiration', array_merge( array(
		'sanitize_callback' => 'sc_recent_posts_sanitize_text'
	), $common_post_meta_args ) );
}, 0 );

function sc_recent_posts_sanitize_url( $value ) {
	return esc_url_raw( $value );
}

function sc_recent_posts_sanitize_text( $value ) {
	return wp_kses( $value, array(
		'a' => array(
			'href' => array()
		)
	) );
}

add_action( 'enqueue_block_editor_assets', function() {
	$assets = require( 'dist/sidebar.asset.php' );

	wp_enqueue_script( 'sc-recent-posts-sidebar', plugins_url( 'dist/sidebar.js', __FILE__ ), $assets['dependencies'], $assets['version'], true );
} );
