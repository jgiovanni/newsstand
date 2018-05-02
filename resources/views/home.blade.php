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

            @guest
                <pdf src="./pdfs/20180425TD.pdf"></pdf>
            @else
                <pdf-doc source="./pdfs/20180425TD.pdf"></pdf-doc>
            @endguest
        </div>
    </div>
</main><!-- /.container -->
@endsection
