<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Raleway:300,400,600" rel="stylesheet" type="text/css">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light navbar-laravel">
            <div class="container">
                <a class="navbar-brand" href="{{ url('/') }}">
                    {{ config('app.name', 'Laravel') }}
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                            <li><a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a></li>
                            <li><a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a></li>
                        @else
                            <li><a class="nav-link" href="#">Today's News</a></li>
                            <li><a class="nav-link" href="#">Past News</a></li>
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    Editorials <span class="caret"></span>
                                </a>
                                <div class="dropdown-menu" aria-labelledby="dropdown01">
                                    <a class="dropdown-item" href="#">Saved for later</a>
                                    <a class="dropdown-item" href="#">Sports</a>
                                    <a class="dropdown-item" href="#">Lifestyle</a>
                                    <a class="dropdown-item" href="#">Most popular</a>
                                    <a class="dropdown-item" href="#">Politics</a>
                                    <a class="dropdown-item" href="#">Nigeria</a>
                                    <a class="dropdown-item" href="#">World</a>
                                    <a class="dropdown-item" href="#">Opinion</a>
                                    <a class="dropdown-item" href="#">Business</a>
                                    <h6 class="dropdown-header">More</h6>
                                    <a class="dropdown-item" href="#">Fashion</a>
                                    <a class="dropdown-item" href="#">Lifestyle</a>
                                    <a class="dropdown-item" href="#">Education</a>
                                    <a class="dropdown-item" href="#">Technology</a>
                                    <a class="dropdown-item" href="#">Deal-books</a>
                                    <a class="dropdown-item" href="#">Science</a>
                                    <a class="dropdown-item" href="#">Climate & Environment</a>
                                    <a class="dropdown-item" href="#">Health</a>
                                    <a class="dropdown-item" href="#">Wellness: Nutrition and Fitness</a>
                                    <a class="dropdown-item" href="#">Arts</a>
                                    <a class="dropdown-item" href="#">Books</a>
                                    <a class="dropdown-item" href="#">Movies</a>
                                    <a class="dropdown-item" href="#">Music</a>
                                    <a class="dropdown-item" href="#">TV</a>
                                    <a class="dropdown-item" href="#">Sunday Review</a>
                                    <a class="dropdown-item" href="#">Food</a>
                                    <a class="dropdown-item" href="#">Weddings</a>
                                    <a class="dropdown-item" href="#">Travel</a>
                                    <a class="dropdown-item" href="#">Magazine</a>
                                    <a class="dropdown-item" href="#">Automobile</a>
                                    <a class="dropdown-item" href="#">Obituaries</a>
                                    <a class="dropdown-item" href="#">Photo Galleria</a>
                                    <a class="dropdown-item" href="#">Videos</a>
                                    <a class="dropdown-item" href="#">Visual Journalism</a>
                                </div>
                            </li>
                            <li><a class="nav-link" href="#">Articles by Name</a></li>
                            <li><a class="nav-link" href="#">Breaking Now</a></li>
                            <li><a class="nav-link" href="#">Subscribe for full news</a></li>

                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }} <span class="caret"></span>
                                </a>

                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('profile') }}">
                                        Profile
                                    </a>
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Logout') }}
                                    </a>

                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main class="py-4">
            @yield('content')
        </main>
    </div>
</body>
</html>
