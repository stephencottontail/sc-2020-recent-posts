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
		return '<p>Hello from PHP!</p>';
	}
		
	add_action( 'init', function() {
		$script_path = 'js/block.js';
		$script_url = plugins_url( $script_path, __FILE__ );

		wp_register_style( 'sc-recent-posts-editor-style', plugins_url( 'js/editor.css', __FILE__ ) );
		wp_register_script( 'sc-recent-posts-editor-script', $script_url, array( 'wp-api-fetch', 'wp-blocks', 'wp-data', 'wp-element' ) );

		$recent_posts = new SC_Recent_Posts();
		register_block_type( $recent_posts );
	} );
