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
		public $editor_style = 'sc-recent-posts-editor-style';
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
				'editor_style'  => $this->editor_style,
			) );
		}

		public function set_props( $args ) {
			parent::set_props( array( 'render_callback' => $this->render_callback ) );
		}
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
				<div class="wp-block-sc-recent-posts__windows" style="<?php printf( 'background-image: url(%s);', $background_image ); ?>">
					<div class="wp-block-sc-recent-posts__window">
						<div class="top-shade"></div>
						<div class="bottom-shade"></div>
					</div>
					<div class="wp-block-sc-recent-posts__window">
						<div class="top-shade"></div>
						<div class="bottom-shade"></div>
					</div>
					<div class="wp-block-sc-recent-posts__window">
						<div class="top-shade"></div>
						<div class="bottom-shade"></div>
					</div>
					<div class="wp-block-sc-recent-posts__door"></div>
				</div><!-- .wp-block-sc-recent-posts__windows -->
				<?php
					printf( '<div class="wp-block-sc-recent-posts__jsx"><code class="jsx">&lt;<span class="jsx-tag">%s</span> <span class="jsx-attr">type</span>="<span class="jsx-attr-string">%s</span>" <span class="jsx-attr">number</span>="<span class="jsx-attr-string">%s</span>"&gt;</code></div>',
							'RecentPosts',
							$selected_type,
							$posts_per_block
					);
				?>
				<div class="wp-block-sc-recent-posts__entries">
					<?php
						while ( $recent_posts_query->have_posts() ) {
							$recent_posts_query->the_post();

							printf( '<article class="wp-block-sc-recent-posts__entry"><h2 class="wp-block-sc-recent-posts__title"><a href="%s">%s</a></h2><time datetime="%s">%s</time></article>',
									esc_url( get_the_permalink() ),
									esc_html( get_the_title() ),
									esc_attr( get_the_time( DATE_W3C ) ),
									esc_html( get_the_date() )
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

	add_action( 'init', function() {
		$script_path = 'js/block.js';
		$script_url = plugins_url( $script_path, __FILE__ );

		wp_register_script( 'sc-recent-posts-editor-script', $script_url, array( 'wp-block-editor', 'wp-components', 'wp-blocks', 'wp-data', 'wp-element', 'moment' ) );

		$recent_posts = new SC_Recent_Posts();
		register_block_type( $recent_posts );
	} );

	add_action( 'init', function() {
		register_post_type( 'themes', array(
			'labels' => array(
				'singular_name' => 'Theme Post',
				'name'          => 'Theme Posts'
			),
			'public' => true,
			'has_archive' => true,
			'rewrite' => array(
				'slug' => 'themes'
			),
			'show_in_rest' => true
		) );

		register_post_type( 'projects', array(
			'labels' => array(
				'singular_name' => 'Project',
				'name'          => 'Projects'
			),
			'public' => true,
			'has_archive' => true,
			'rewrite' => array(
				'slug' => 'projects'
			),
			'show_in_rest' => true
		) );

		wp_oembed_add_provider( 'https://codepen.io/*/pen/*', 'https://codepen.io/api/oembed' );

		add_post_type_support( 'themes', 'custom-fields' );
		add_post_type_support( 'projects', 'custom-fields' );

		register_post_meta( 'projects', 'sc_recent_posts_codepen_url', array(
			'show_in_rest' => true,
			'single'       => true,
			'type'         => 'string'
		) );
	} );

	add_action( 'enqueue_block_editor_assets', function() {
		wp_enqueue_script( 'sc-recent-posts-sidebar', plugins_url( 'js/sidebar.js', __FILE__ ), array( 'wp-block-editor', 'wp-compose',  'wp-data', 'wp-edit-post', 'wp-element', 'wp-plugins' ) );
	} );
