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
                        <h1>Past News</h1>
                    </div>
                    <pdf-doc source="/pdfs/{{ $date }}TD.pdf" :full-access="{{ auth()->check() && Auth()->user()->subscription_active ? 'true' : 'false' }}"></pdf-doc>
            </div>
        </div>
    </main><!-- /.container -->
@endsection