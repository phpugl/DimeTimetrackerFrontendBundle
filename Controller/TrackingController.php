<?php

namespace Dime\TimetrackerFrontendBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\Response;

class TrackingController extends Controller
{
    /**
     * @Route("/")
     * @Method("GET")
     * @Template(engine="haml")
     */
    public function indexAction()
    {
        return array();
    }

    /**
     * @Route("/template/{name}")
     * @Method("GET")
     * @param  string   $name
     * @return Response A Response instance
     */
    public function templateAction($name)
    {
      return $this->render($name . '.html.twig');
    }
}
