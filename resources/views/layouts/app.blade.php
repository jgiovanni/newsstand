<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#b91d47">
    <meta name="theme-color" content="#ffffff">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>This Day</title>

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
        @guest
            <nav class="navbar navbar-expand-md navbar-dark navbar-laravel">
                <div class="container-fluid">
                    <a class="navbar-brand" href="{{ url('/') }}">
                        <img src="{{ asset('thisday-logo-300x72.png') }}" width="125" height="30" class="d-inline-block align-top" alt="This Day">
                    </a>
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">
                        <!-- Authentication Links -->
                        <li><a class="nav-link" href="#{{ route('login') }}" data-toggle="modal" data-target="#loginModal">{{ __('Login') }}</a></li>
                        <li><a class="nav-link" href="#{{ route('register') }}" data-toggle="modal" data-target="#registerModal">{{ __('Register') }}</a></li>

                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <!-- Authentication Links -->
                        @guest
                        @else
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
                            <li><a class="nav-link" href="#">Subscribe for Full News</a></li>
                        @endguest
                    </ul>
                </div>
            </nav>
        @else
            <nav class="navbar navbar-expand-md navbar-dark navbar-laravel">
                <div class="container-fluid">
                    <a class="navbar-brand" href="{{ url('/') }}">
                        <img src="{{ asset('thisday-logo-300x72.png') }}" width="125" height="30" class="d-inline-block align-top" alt="This Day">
                    </a>
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav mr-auto">
                        <!-- Authentication Links -->
                        @guest
                            <li><a class="nav-link" href="{{ route('login') }}">{{ __('Login') }}</a></li>
                            <li><a class="nav-link" href="{{ route('register') }}">{{ __('Register') }}</a></li>
                        @else
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
                            <li><a class="nav-link" href="#">Subscribe for Full News</a></li>
                        @endguest
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ml-auto">
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSubnavContent" aria-controls="navbarSubnavContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </ul>
                </div>
            </nav>
            <nav class="navbar navbar-expand-md navbar-light sticky-top bg-light navbar-subnav">
                    <div class="container">

                        {{--<a class="navbar-brand" href="{{ url('/') }}">
                            <img src="{{ asset('thisday-logo-300x72.png') }}" width="125" height="30" class="d-inline-block align-top" alt="This Day">
                        </a>--}}

                        <div class="collapse navbar-collapse" id="navbarSubnavContent">
                            <!-- Left Side Of Navbar -->
                            <ul class="navbar-nav mr-auto">
                                <li><a class="nav-link" href="{{ route('today') }}">Today's News</a></li>
                                <li><a class="nav-link" href="{{ route('past') }}">Past News</a></li>
                                <li class="nav-item dropdown">
                                    <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                        Editorials <span class="caret"></span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="dropdown01">
                                        <a class="dropdown-item" href="{{ route('editorials', 'saved-for-later') }}">Saved for later</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'sports') }}">Sports</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'lifestyle') }}">Lifestyle</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'most-popular') }}">Most popular</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'politics') }}">Politics</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'nigeria') }}">Nigeria</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'world') }}">World</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'opinion') }}">Opinion</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'business') }}">Business</a>
                                        <h6 class="dropdown-header">More</h6>
                                        <a class="dropdown-item" href="{{ route('editorials', 'fashion') }}">Fashion</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'lifestyle') }}">Lifestyle</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'education') }}">Education</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'technology') }}">Technology</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'deal-books') }}">Deal-books</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'science') }}">Science</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'climate--environment') }}">Climate & Environment</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'health') }}">Health</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'wellness-nutrition--fitness') }}">Wellness: Nutrition and Fitness</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'arts') }}">Arts</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'books') }}">Books</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'movies') }}">Movies</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'music') }}">Music</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'TV') }}">TV</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'sunday-review') }}">Sunday Review</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'food') }}">Food</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'weddings') }}">Weddings</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'travel') }}">Travel</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'magazine') }}">Magazine</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'automobile') }}">Automobile</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'obituaries') }}">Obituaries</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'photo-galleria') }}">Photo Galleria</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'videos') }}">Videos</a>
                                        <a class="dropdown-item" href="{{ route('editorials', 'visual-journalism')}}">Visual Journalism</a>
                                    </div>
                                </li>
                                <li><a class="nav-link" href="{{ route('articles') }}">Articles by Name</a></li>
                                <li><a class="nav-link" href="{{ route('breaking-news') }}">Breaking News</a></li>
                            </ul>
    
                            <!-- Right Side Of Navbar -->
                            <ul class="navbar-nav ml-auto">

                            </ul>
                        </div>
                    </div>
                </nav>
        @endauth

        <main class="py-4">
            @yield('content')
        </main>

        @guest
            <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Login</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="loginForm" name="loginForm" method="POST" action="{{ route('login') }}">
                                @csrf

                                <div class="form-group row">
                                    <label for="email" class="col-sm-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                                    <div class="col-md-6">
                                        <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required autofocus>

                                        @if ($errors->has('email'))
                                            <span class="invalid-feedback">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                                    <div class="col-md-6">
                                        <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

                                        @if ($errors->has('password'))
                                            <span class="invalid-feedback">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col-md-6 offset-md-4">
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : '' }}> {{ __('Remember Me') }}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group row mb-0">
                                    <div class="col-md-8 offset-md-4">
                                        <button type="submit" class="btn btn-primary">
                                            {{ __('Login') }}
                                        </button>

                                        <a class="btn btn-link" href="{{ route('password.request') }}">
                                            {{ __('Forgot Your Password?') }}
                                        </a>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {{--<div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>--}}
                    </div>
                </div>
            </div>
            <div class="modal fade" id="registerModal" tabindex="-1" role="dialog" aria-labelledby="registerModal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Register</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form id="registrationForm" name="registrationForm" method="POST" action="{{ route('register') }}">
                                @csrf

                                <div class="form-group row">
                                    <label for="name" class="col-md-4 col-form-label text-md-right">{{ __('Name') }}</label>

                                    <div class="col-md-6">
                                        <input id="name" type="text" class="form-control{{ $errors->has('name') ? ' is-invalid' : '' }}" name="name" value="{{ old('name') }}" required autofocus>

                                        @if ($errors->has('name'))
                                            <span class="invalid-feedback">
                                    <strong>{{ $errors->first('name') }}</strong>
                                </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="email" class="col-md-4 col-form-label text-md-right">{{ __('E-Mail Address') }}</label>

                                    <div class="col-md-6">
                                        <input id="email" type="email" class="form-control{{ $errors->has('email') ? ' is-invalid' : '' }}" name="email" value="{{ old('email') }}" required>

                                        @if ($errors->has('email'))
                                            <span class="invalid-feedback">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="password" class="col-md-4 col-form-label text-md-right">{{ __('Password') }}</label>

                                    <div class="col-md-6">
                                        <input id="password" type="password" class="form-control{{ $errors->has('password') ? ' is-invalid' : '' }}" name="password" required>

                                        @if ($errors->has('password'))
                                            <span class="invalid-feedback">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                                        @endif
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <label for="password-confirm" class="col-md-4 col-form-label text-md-right">{{ __('Confirm Password') }}</label>

                                    <div class="col-md-6">
                                        <input id="password-confirm" type="password" class="form-control" name="password_confirmation" required>
                                    </div>
                                </div>

                                <div class="form-group row mb-0">
                                    <div class="col-md-6 offset-md-4">
                                        <button type="submit" class="btn btn-primary">
                                            {{ __('Register') }}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        {{--<div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>--}}
                    </div>
                </div>
            </div>
            <div class="modal fade" id="resetModal" tabindex="-1" role="dialog" aria-labelledby="resetModal" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" form="registration">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            ...
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        @endguest
        <footer>

        </footer>
    </div>
</body>
</html>
