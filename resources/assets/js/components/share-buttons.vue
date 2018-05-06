<template>
	<nav class="nav icon-bar">
		<social-sharing :url="currentUrl" title="This Day" description=""
		                quote="" hashtags="thisday, newspaper" twitter-user="" inline-template>
			<div>
				<network network="email" class="email">
					<i class="fa fa-envelope"></i>
				</network>
				<network network="facebook" class="facebook">
					<i class="fa fa-facebook"></i>
				</network>
				<network network="googleplus" class="google">
					<i class="fa fa-google-plus"></i>
				</network>
				<network network="pinterest" class="pinterest">
					<i class="fa fa-pinterest"></i>
				</network>
				<network network="twitter" class="twitter">
					<i class="fa fa-twitter"></i>
				</network>
			</div>
		</social-sharing>

	</nav>
</template>
<style>
	.pdf-share {
		top: 20px;
		left: 10px;
	}
	.icon-bar {
		position: fixed;
		top: 50%;
		-webkit-transform: translateY(-50%) scale(.75, .75);
		-ms-transform: translateY(-50%) scale(.75, .75);
		transform: translateY(-50%) scale(.75, .75);
	}

	@media (max-width: 768px) {
		.icon-bar {
			-webkit-transform: translateY(-50%) scale(.25, .25);
			-ms-transform: translateY(-50%) scale(.25, .25);
			transform: translateY(-50%) scale(.25, .25);
			left: -5px;
		}
	}

	.icon-bar span {
		display: block;
		text-align: center;
		padding: 16px;
		transition: all 0.3s ease;
		color: white;
		font-size: 20px;
	}

	.icon-bar span:hover {
		background-color: #000;
	}

	.facebook {
		background: #3B5998;
		color: white;
	}

	.twitter {
		background: #55ACEE;
		color: white;
	}

	.google {
		background: #dd4b39;
		color: white;
	}

	.email {
		background: #222222;
		color: white;
	}

	.pinterest {
		background: #bb0000;
		color: white;
	}
</style>
<script type="text/javascript">
  import stickybits from 'stickybits';

  export default {
    name: 'share-buttons',
    data() {
      return {
        currentUrl: window.location.href,
        //shareIcons: {emailShare, fbShare, gplusShare, pinShare, twitShare},
      }
    },
    methods: {},
    mounted() {
    }
  }
</script>