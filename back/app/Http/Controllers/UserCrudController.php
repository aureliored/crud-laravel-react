<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserCrud;

class UserCrudController extends Controller
{
    private $defaultValidate = [
        'name'=>'required',
        'cpf'=>'required',
        'phone'=>'required',
        'pass'=>'required',
        'birthdate'=>'required',
    ];
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userCrud = UserCrud::all();

        return response()->json([
            'response' => 'success',
            'data' => compact('userCrud'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
      $request->validate($this->defaultValidate);

      $userCrud = new UserCrud([
          'name' => $request->get('name'),
          'cpf' => $request->get('cpf'),
          'phone' => $request->get('phone'),
          'pass' => $request->get('pass'),
          'birthdate' => $request->get('birthdate')
      ]);
      $userCrud->save();
      return response()->json([
          'response' => 'success',
      ]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $userCrud = UserCrud::find($id);

        return response()->json([
            'response' => 'success',
            'data' => compact('userCrud'),
        ]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate($this->defaultValidate);

        $userCrud = UserCrud::find($id);
        $userCrud->name =  $request->get('name');
        $userCrud->cpf = $request->get('cpf');
        $userCrud->phone = $request->get('phone');
        $userCrud->pass = $request->get('pass');
        $userCrud->birthdate = $request->get('birthdate');
        $userCrud->save();
        return response()->json([
           'response' => 'success',
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
      $userCrud = UserCrud::find($id);
      $userCrud->delete();

      return response()->json([
          'response' => 'success',
      ]);
    }
}
