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

            <pdf-doc source="/pdfs/20180425TD.pdf" :full-access="{{ auth()->check() ? Auth()->subscription_active : 'false' }}"></pdf-doc>
        </div>
    </div>
</main><!-- /.container -->
@endsection