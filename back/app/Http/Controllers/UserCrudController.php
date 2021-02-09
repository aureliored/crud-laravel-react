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
      $data = $this->getDataRequest($request);
      $newUser = new UserCrud([
          'name' => $data['name'],
          'cpf' => $data['cpf'],
          'phone' => $data['phone'],
          'pass' => $data['pass'],
          'birthdate' => $data['birthdate']
      ]);

      $userCrud = $newUser;
      $userCrud->save();
      return response()->json([
          'response' => 'success',
      ]);

      // return response()->json($data['name']);
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
        $data = $this->getDataRequest($request);
        $userCrud = UserCrud::find($id);
        $userCrud->name =  $data['name'];
        $userCrud->cpf = $data['cpf'];
        $userCrud->phone = $data['phone'];
        $userCrud->pass = $data['pass'];
        $userCrud->birthdate = $data['birthdate'];
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

    private function getDataRequest($request)
    {
      return json_decode($request->getContent(), true)['User'];
    }
}
