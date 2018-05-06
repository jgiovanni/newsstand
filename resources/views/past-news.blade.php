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
                <h1>Past News</h1>
                <datepicker :value="pastPapers.date" :highlighted="pastPapers.highlighted" @@input="loadPdf"></datepicker>
                    <pdf-doc :source="pastPapers.pdf" :full-access="{{ auth()->check() && Auth()->user()->subscription_active ? 'true' : 'false' }}"></pdf-doc>
            </div>
        </div>
    </main><!-- /.container -->
@endsection