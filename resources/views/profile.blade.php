@extends('layouts.app')

@section('content')
    <main role="main" class="container-fluid">
        <div class="row justify-content-center">
            <div class="col-md-12">
                @if (session('status'))
                    <div class="alert alert-success">
                        {{ session('status') }}
                    </div>
                @endif
                    <div class="container">
                        <h1>Profile</h1>

                    </div>
            </div>
        </div>
    </main><!-- /.container -->
@endsection